import { ChevronRight } from 'lucide-react';

interface SecurityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export function SecurityItem({
  icon,
  title,
  description,
  badge,
  action
}: SecurityItemProps) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5 sm:px-7">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 text-stone-400 dark:text-stone-500">{icon}</div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-stone-800 dark:text-stone-100">
              {title}
            </h3>
            {badge}
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400">
            {description}
          </p>
        </div>
      </div>

      {action ?? (
        <ChevronRight className="h-5 w-5 text-stone-300 dark:text-stone-600" />
      )}
    </div>
  );
}
