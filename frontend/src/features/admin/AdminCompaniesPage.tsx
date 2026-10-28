import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Badge } from '@/components/Badge';
import { FullPageSpinner } from '@/components/Spinner';
import type { Company, PaginatedResult } from '@/types';

interface AdminCompany extends Company {
  _count: { jobs: number; recruiters: number };
}

const adminApi = {
  listCompanies: () => apiClient.get<PaginatedResult<AdminCompany>>('/admin/companies').then((r) => r.data),
};

export const AdminCompaniesPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'companies'], queryFn: adminApi.listCompanies });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Companies</h1>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Jobs</th>
              <th className="px-4 py-2">Recruiters</th>
              <th className="px-4 py-2">Verified</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 font-medium text-slate-900">{c.name}</td>
                <td className="px-4 py-2">{c._count.jobs}</td>
                <td className="px-4 py-2">{c._count.recruiters}</td>
                <td className="px-4 py-2">
                  <Badge tone={c.isVerified ? 'green' : 'slate'}>{c.isVerified ? 'Verified' : 'Unverified'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
