import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
};

export function PageHeader({ title, description, icon: Icon, className }: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 p-4 md:p-6 lg:p-8', className)}>
      <div className="flex items-center gap-4">
        {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
      {description && <p className="text-lg text-muted-foreground">{description}</p>}
    </div>
  );
}
