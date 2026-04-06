type BadgeVariant = 'status' | 'priority' | 'role' | 'default';

interface BadgeProps {
  value: string;
  variant?: BadgeVariant;
  className?: string;
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  waiting_for_customer: 'bg-orange-100 text-orange-700',
  closed: 'bg-gray-100 text-gray-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const roleColors: Record<string, string> = {
  user: 'bg-gray-100 text-gray-700',
  support: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
};

export function Badge({ value, variant = 'default', className = '' }: BadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-700';

  if (variant === 'status') {
    colorClass = statusColors[value] ?? colorClass;
  } else if (variant === 'priority') {
    colorClass = priorityColors[value] ?? colorClass;
  } else if (variant === 'role') {
    colorClass = roleColors[value] ?? colorClass;
  }

  const label = value.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
