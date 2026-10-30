import { Badge } from '@/components/Badge';
import type { AtsResult } from '@/types';

const barTone = (score: number) => (score >= 70 ? 'bg-green-500' : score >= 45 ? 'bg-amber-500' : 'bg-red-500');
const statusLabel = { met: 'Met', partial: 'Partial', missing: 'Missing' } as const;

export const AtsReport = ({ result }: { result: AtsResult }) => {
  const { ai } = result;
  return (
    <div className="mt-3 rounded-lg border border-slate-200 p-4 text-sm">
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-semibold text-slate-900">ATS score: {result.score}/100</p>
        <span className="text-xs text-slate-500">{ai ? 'AI + rules analysis' : 'Rules-based analysis'}</span>
      </div>
      {ai && <p className="mt-1 text-slate-700">{ai.verdict}</p>}

      <ul className="mt-3 flex flex-col gap-2">
        {result.checks.map((c) => (
          <li key={c.key}>
            <div className="flex justify-between text-xs text-slate-600">
              <span>
                {c.label} <span className="text-slate-400">({c.weight}%{c.source === 'ai' ? ', AI' : ''})</span>
              </span>
              <span className="font-medium">{c.score}</span>
            </div>
            <div className="mt-1 h-1.5 rounded bg-slate-100">
              <div className={`h-1.5 rounded ${barTone(c.score)}`} style={{ width: `${c.score}%` }} />
            </div>
          </li>
        ))}
      </ul>

      {ai && (
        <>
          <h3 className="mt-4 font-semibold text-slate-900">Requirements</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {ai.requirements.map((r) => (
              <li key={r.requirement} className="rounded border border-slate-100 p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-800">{r.requirement}</span>
                  <Badge tone={r.status === 'met' ? 'green' : r.status === 'partial' ? 'amber' : 'red'}>{statusLabel[r.status]}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{r.evidence}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-slate-900">Strengths</h3>
              <ul className="mt-1 list-disc pl-5 text-slate-700">
                {ai.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Gaps</h3>
              <ul className="mt-1 list-disc pl-5 text-slate-700">
                {ai.gaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {ai.rewrites.length > 0 && (
            <>
              <h3 className="mt-4 font-semibold text-slate-900">Suggested rewrites</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {ai.rewrites.map((r) => (
                  <li key={r.original} className="rounded border border-slate-100 p-2">
                    <p className="text-xs text-slate-500 line-through">{r.original}</p>
                    <p className="mt-1 text-slate-800">{r.improved}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {result.missingKeywords.length > 0 && (
        <p className="mt-4 text-xs text-slate-500">Missing keywords: {result.missingKeywords.join(', ')}</p>
      )}
      {!ai && result.suggestions.length > 0 && (
        <ul className="mt-3 list-disc pl-5 text-slate-700">
          {result.suggestions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
