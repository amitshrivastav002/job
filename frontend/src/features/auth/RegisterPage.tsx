import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/lib/apiClient';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { clsx } from '@/utils/clsx';
import { GoogleLoginButton } from './GoogleLoginButton';
import { AppleLoginButton } from './AppleLoginButton';

const baseSchema = {
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Enter your full name'),
};
const jobSeekerSchema = z.object(baseSchema);
const recruiterSchema = z.object({ ...baseSchema, companyName: z.string().min(2, 'Company name is required') });

type Role = 'JOB_SEEKER' | 'RECRUITER';

export const RegisterPage = () => {
  const [role, setRole] = useState<Role>('JOB_SEEKER');
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const schema = role === 'JOB_SEEKER' ? jobSeekerSchema : recruiterSchema;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof recruiterSchema>>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof recruiterSchema>) =>
      role === 'JOB_SEEKER' ? authApi.registerJobSeeker(values) : authApi.registerRecruiter(values),
    onSuccess: (data) => {
      setSession(data);
      navigate(data.user.role === 'RECRUITER' ? '/recruiter/jobs' : '/jobs');
    },
  });

  const oauthMutation = useMutation({
    mutationFn: (vars: { provider: 'google' | 'apple'; idToken: string }) => {
      const payload = { idToken: vars.idToken, role, companyName: watch('companyName') };
      return vars.provider === 'google' ? authApi.oauthGoogle(payload) : authApi.oauthApple(payload);
    },
    onSuccess: (data) => {
      setSession(data);
      navigate(data.user.role === 'RECRUITER' ? '/recruiter/jobs' : '/jobs');
    },
  });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">Find your next role, or your next hire.</p>
      </div>
      <div className="flex rounded-lg border border-slate-300 p-1 text-sm">
        {(['JOB_SEEKER', 'RECRUITER'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={clsx(
              'flex-1 rounded-md py-1.5 font-medium transition-colors',
              role === r ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {r === 'JOB_SEEKER' ? "I'm looking for a job" : "I'm hiring"}
          </button>
        ))}
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <Input label="Full name" {...register('fullName')} error={errors.fullName?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        {role === 'RECRUITER' && (
          <Input label="Company name" {...register('companyName')} error={errors.companyName?.message} />
        )}
        {mutation.isError && <p className="text-sm text-red-600">{getApiErrorMessage(mutation.error)}</p>}
        <Button type="submit" isLoading={mutation.isPending}>
          Create account
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
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};
