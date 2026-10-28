import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from '@/utils/clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx(
          'rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition-colors',
          'border-slate-300 focus:border-brand-500',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
