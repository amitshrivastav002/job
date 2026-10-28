import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/lib/apiClient';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { GoogleLoginButton } from './GoogleLoginButton';
import { AppleLoginButton } from './AppleLoginButton';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const setSession = useAuthStore((s) => s.setSession);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setSession(data);
      navigate(from ?? (data.user.role === 'RECRUITER' ? '/recruiter/jobs' : '/jobs'));
    },
  });

  const oauthMutation = useMutation({
    mutationFn: (vars: { provider: 'google' | 'apple'; idToken: string }) =>
      vars.provider === 'google'
        ? authApi.oauthGoogle({ idToken: vars.idToken })
        : authApi.oauthApple({ idToken: vars.idToken }),
    onSuccess: (data) => {
      setSession(data);
      navigate(from ?? (data.user.role === 'RECRUITER' ? '/recruiter/jobs' : '/jobs'));
    },
  });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600">Log in to continue your job search or hiring.</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        {mutation.isError && <p className="text-sm text-red-600">{getApiErrorMessage(mutation.error)}</p>}
        <Button type="submit" isLoading={mutation.isPending}>
          Log in
        </Button>
      </form>
      <div className="flex items-center gap-3 text-xs uppercase text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <GoogleLoginButton onToken={(idToken) => oauthMutation.mutate({ provider: 'google', idToken })} />
        <AppleLoginButton onToken={(idToken) => oauthMutation.mutate({ provider: 'apple', idToken })} />
        {oauthMutation.isError && (
          <p className="text-sm text-red-600">{getApiErrorMessage(oauthMutation.error)}</p>
        )}
      </div>
      <p className="text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};
