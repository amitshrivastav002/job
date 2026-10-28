import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FullPageSpinner } from '@/components/Spinner';
import type { PaginatedResult, Role } from '@/types';

interface AdminUser {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

const adminApi = {
  listUsers: () => apiClient.get<PaginatedResult<AdminUser>>('/admin/users').then((r) => r.data),
  setUserActive: (id: string, isActive: boolean) =>
    apiClient.patch<AdminUser>(`/admin/users/${id}/active`, { isActive }).then((r) => r.data),
};

export const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: adminApi.listUsers });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.setUserActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Users</h1>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {data?.items.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">
                  <Badge tone={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Active' : 'Suspended'}</Badge>
                </td>
                <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">
                  <Button
                    variant={u.isActive ? 'danger' : 'secondary'}
                    onClick={() => toggleActive.mutate({ id: u.id, isActive: !u.isActive })}
                  >
                    {u.isActive ? 'Suspend' : 'Reactivate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
