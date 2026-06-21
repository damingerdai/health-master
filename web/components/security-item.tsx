import { ChevronRight } from "lucide-react";

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
  action,
}: SecurityItemProps) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <div className="flex items-start gap-4">
        <div className="mt-1">{icon}</div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {badge}
          </div>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {action ?? (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
}