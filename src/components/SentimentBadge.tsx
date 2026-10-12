import { type SentimentLabel } from '@/lib/nlp';
import { Smile, Frown, Meh } from 'lucide-react';

export function SentimentBadge({ label, size = 'sm' }: { label: SentimentLabel; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-1.5',
    lg: 'text-base px-5 py-2',
  };

  const config = {
    Positif: { classes: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: Smile },
    Negatif: { classes: 'bg-red-100 text-red-700 border-red-200', Icon: Frown },
    Netral: { classes: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Meh },
  };

  const { classes, Icon } = config[label];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${classes} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />
      {label}
    </span>
  );
}
