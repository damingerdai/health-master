'use client';

import { type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

export function NavMain({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        Platform
      </SidebarGroupLabel>
      <SidebarGroupContent className="mt-1">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || pathname?.startsWith(`${item.url}/`);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "relative transition-all duration-200 hover:bg-accent/50",
                    isActive ? "font-medium text-primary bg-primary/5 shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon 
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          isActive ? "scale-110 text-primary" : "group-hover:scale-110"
                        )} 
                      />
                    )}
                    <span className="truncate">{item.title}</span>
                    {isActive && (
                      <span className="absolute left-0 h-4 w-1 rounded-r-full bg-primary" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}