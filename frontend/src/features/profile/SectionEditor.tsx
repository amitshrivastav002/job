import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileSectionsApi, type SectionKey } from '@/api/profiles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';

type FieldType = 'text' | 'textarea' | 'date' | 'checkbox' | 'select' | 'tags';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
}

interface SectionEditorProps<T extends { id: string }> {
  section: SectionKey;
  title: string;
  fields: FieldConfig[];
  renderSummary: (item: T) => { primary: string; secondary?: string };
}

const toISO = (value: string) => (value ? new Date(value).toISOString() : undefined);

const buildPayload = (fields: FieldConfig[], values: Record<string, string | boolean>) => {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = values[field.name];
    if (field.type === 'checkbox') {
      payload[field.name] = !!raw;
      continue;
    }
    if (raw === undefined || raw === '') continue;
    if (field.type === 'date') {
      payload[field.name] = toISO(raw as string);
    } else if (field.type === 'tags') {
      payload[field.name] = (raw as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      payload[field.name] = raw;
    }
  }
  return payload;
};

export function SectionEditor<T extends { id: string }>({
  section,
  title,
  fields,
  renderSummary,
}: SectionEditorProps<T>) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState<Record<string, string | boolean>>({});

  const { data: items } = useQuery({
    queryKey: ['profile-section', section],
    queryFn: () => profileSectionsApi.list<T>(section),
  });

  const create = useMutation({
    mutationFn: (payload: Record<string, unknown>) => profileSectionsApi.create<T>(section, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-section', section] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'job-seeker'] });
      setValues({});
      setShowForm(false);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => profileSectionsApi.remove(section, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-section', section] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'job-seeker'] });
    },
  });

  const setField = (name: string, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="border-t border-slate-200 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <Button variant="ghost" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add'}
        </Button>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {items?.map((item) => {
          const { primary, secondary } = renderSummary(item);
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">{primary}</p>
                {secondary && <p className="text-xs text-slate-500">{secondary}</p>}
              </div>
              <Button variant="ghost" onClick={() => remove.mutate(item.id)}>
                Remove
              </Button>
            </div>
          );
        })}
        {items?.length === 0 && <p className="text-sm text-slate-500">Nothing added yet.</p>}
      </div>

      {showForm && (
        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 p-4">
          {fields.map((field) => {
            if (field.type === 'checkbox') {
              return (
                <label key={field.name} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!values[field.name]}
                    onChange={(e) => setField(field.name, e.target.checked)}
                  />
                  {field.label}
                </label>
              );
            }
            if (field.type === 'textarea') {
              return (
                <Textarea
                  key={field.name}
                  label={field.label}
                  value={(values[field.name] as string) ?? ''}
                  onChange={(e) => setField(field.name, e.target.value)}
                />
              );
            }
            if (field.type === 'select') {
              return (
                <div key={field.name} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">{field.label}</label>
                  <select
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500"
                    value={(values[field.name] as string) ?? ''}
                    onChange={(e) => setField(field.name, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            return (
              <Input
                key={field.name}
                label={field.label}
                type={field.type === 'date' ? 'date' : 'text'}
                value={(values[field.name] as string) ?? ''}
                onChange={(e) => setField(field.name, e.target.value)}
              />
            );
          })}
          <Button
            type="button"
            isLoading={create.isPending}
            className="w-fit"
            onClick={() => create.mutate(buildPayload(fields, values))}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
