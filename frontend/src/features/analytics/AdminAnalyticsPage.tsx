import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import { FullPageSpinner } from '@/components/Spinner';

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const BreakdownList = ({ title, rows }: { title: string; rows: Array<{ status: string; count: number }> }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="font-semibold text-slate-900">{title}</p>
    <div className="mt-3 flex flex-col gap-2">
      {rows.length === 0 && <p className="text-sm text-slate-500">No data yet.</p>}
      {rows.map((row) => (
        <div key={row.status} className="flex items-center justify-between text-sm">
          <span className="text-slate-600">{row.status.replace('_', ' ')}</span>
          <span className="font-medium text-slate-900">{row.count}</span>
        </div>
      ))}
    </div>
  </div>
);

export const AdminAnalyticsPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['analytics', 'admin'], queryFn: analyticsApi.adminStats });

  if (isLoading) return <FullPageSpinner />;
  if (!data) return null;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <StatCard label="Total companies" value={data.totalCompanies} />
        <StatCard label="Total applications" value={data.totalApplications} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <BreakdownList title="Jobs by status" rows={data.jobsByStatus} />
        <BreakdownList
          title="Users by role"
          rows={data.usersByRole.map((r) => ({ status: r.role, count: r.count }))}
        />
      </div>
    </div>
  );
};
