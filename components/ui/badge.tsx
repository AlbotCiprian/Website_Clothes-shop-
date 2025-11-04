import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        variant === 'default'
          ? 'border-transparent bg-brand text-white shadow-soft'
          : 'border-slate-200 bg-white text-slate-700',
        className
      )}
      {...props}
    />
  );
}
