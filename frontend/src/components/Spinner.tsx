export const Spinner = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <span className={`inline-block animate-spin rounded-full border-2 border-brand-600 border-t-transparent ${className}`} />
);

export const FullPageSpinner = () => (
  <div className="flex h-[60vh] items-center justify-center">
    <Spinner className="h-8 w-8" />
  </div>
);
