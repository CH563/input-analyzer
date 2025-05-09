
'use client';

import { cn } from '@/lib/utils';

export const KeyStatusLegend = () => {
  const legendItems = [
    { label: 'Active', colorClass: 'bg-accent' },
    { label: 'Pressed', colorClass: 'bg-secondary' },
    { label: 'Never', colorClass: 'bg-card border border-border' },
  ];

  return (
    <div className="flex items-center space-x-2 p-1 rounded-md border bg-muted text-xs shadow-sm">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center space-x-1.5 px-1">
          <span className={cn('h-3 w-3 rounded-sm block', item.colorClass)} />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
