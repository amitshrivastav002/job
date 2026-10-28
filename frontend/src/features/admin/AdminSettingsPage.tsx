import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Badge } from '@/components/Badge';
import { FullPageSpinner } from '@/components/Spinner';
import type { AdminSettings } from '@/types';

const adminApi = {
  getSettings: () => apiClient.get<AdminSettings>('/admin/settings').then((r) => r.data),
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);

export const AdminSettingsPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'settings'], queryFn: adminApi.getSettings });

  if (isLoading) return <FullPageSpinner />;
  if (!data) return null;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
        <Row label="Environment" value={data.nodeEnv} />
        <Row label="CORS origin" value={data.corsOrigin} />
        <Row label="Rate limit" value={`${data.rateLimit.max} req / ${data.rateLimit.windowMs}ms`} />
        <Row label="Access token expiry" value={data.accessTokenExpiresIn} />
        <Row label="Refresh token expiry" value={data.refreshTokenExpiresIn} />
        <Row
          label="Google OAuth"
          value={<Badge tone={data.googleOAuthEnabled ? 'green' : 'slate'}>{data.googleOAuthEnabled ? 'Enabled' : 'Disabled'}</Badge>}
        />
        <Row
          label="Apple OAuth"
          value={<Badge tone={data.appleOAuthEnabled ? 'green' : 'slate'}>{data.appleOAuthEnabled ? 'Enabled' : 'Disabled'}</Badge>}
        />
      </div>
    </div>
  );
};
