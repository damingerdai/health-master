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
    <SidebarGroup className="p-1">
      <SidebarGroupLabel className="px-3 text-[11px] font-medium tracking-wider text-stone-400 uppercase dark:text-stone-500">
        Daily Journal
      </SidebarGroupLabel>
      <SidebarGroupContent className="mt-1.5">
        <SidebarMenu className="gap-1">
          {items.map(item => {
            const isActive =
              pathname === item.url ||
              pathname?.startsWith(`${item.url}/`) ||
              pathname === `${item.url}-new`;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={
                    <Link href={item.url} className="flex items-center gap-3" />
                  }
                  size="lg"
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    'relative h-10 rounded-xl px-3 text-sm transition-all duration-300',
                    isActive
                      ? 'bg-white/90 font-medium text-[#3F6254] shadow-[0_4px_20px_-4px_rgba(63,98,84,0.12)] ring-1 ring-stone-200/80 dark:bg-stone-900/90 dark:text-emerald-300 dark:ring-stone-800'
                      : 'font-normal text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900/60 dark:hover:text-stone-200'
                  )}
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        'size-4 shrink-0 transition-transform duration-300',
                        isActive
                          ? 'text-[#3F6254] dark:text-emerald-400'
                          : 'text-stone-400 group-hover:text-stone-600 dark:text-stone-500 dark:group-hover:text-stone-300'
                      )}
                    />
                  )}
                  <span className="truncate">{item.title}</span>
                  {isActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-[#3F6254] dark:bg-emerald-400" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
