import type { LucideIcon } from 'lucide-react';

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface StatsCounterProps {
  stats: StatItem[];
}

export function StatsCounter({ stats }: StatsCounterProps) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="text-center">
            <Icon className="mx-auto h-8 w-8 text-amil-blue" />
            <p className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
