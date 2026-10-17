'use client';

import * as React from 'react';
import { useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { IconLoader3 } from '@tabler/icons-react';
import {
  LayoutDashboard,
  HeartPulse,
  Scale,
  Thermometer,
  Ruler,
  Leaf,
  Sparkles
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { advancedGravatar } from '@/lib/gravatar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const avatar = useMemo(() => {
    if (!user) {
      return '/avatars/shadcn.jpg';
    }
    if (user.email) {
      return advancedGravatar(user.email);
    }
    if (user.image) {
      return user.image;
    }
    return '/avatars/shadcn.jpg';
  }, [user]);

  const items = [
    {
      title: 'Overview',
      url: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Blood Pressure',
      url: '/blood-pressure',
      icon: HeartPulse
    },
    {
      title: 'Weight',
      url: '/weight',
      icon: Scale
    },
    {
      title: 'Temperature',
      url: '/temperature',
      icon: Thermometer
    },
    {
      title: 'Height',
      url: '/height',
      icon: Ruler
    }
  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      className="text-stone-800 dark:text-stone-100"
      {...props}
    >
      <SidebarHeader className="px-3 pt-4 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              size="lg"
              className="group rounded-2xl px-2.5 py-2 transition-colors hover:bg-stone-200/50 dark:hover:bg-stone-900"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#3F6254] text-stone-50 shadow-2xs transition-transform duration-300 group-hover:scale-105 dark:bg-emerald-800">
                <Leaf className="size-4" />
              </span>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-sm font-medium tracking-tight text-stone-800 dark:text-stone-100">
                  Health Master
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  Wellness Sanctuary
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <NavMain items={items} />
      </SidebarContent>

      <SidebarFooter className="gap-3 px-3 pb-4">
        <div className="rounded-2xl border border-stone-200/70 bg-white/60 p-3.5 backdrop-blur-xs dark:border-stone-800/80 dark:bg-stone-900/50">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#3F6254] dark:text-emerald-300">
            <Sparkles className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Mindful Check-in</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
            Every gentle observation is an act of care for your body.
          </p>
        </div>

        {status === 'loading' && (
          <div className="flex items-center justify-center py-3">
            <IconLoader3 className="size-4 animate-spin text-stone-400" />
          </div>
        )}
        {status === 'authenticated' && session?.user && (
          <NavUser
            user={{
              name:
                [session.user.firstName, session.user.lastName]
                  .filter(Boolean)
                  .join(' ') ||
                session.user.username ||
                'User',
              firstName: session.user.firstName ?? '',
              lastName: session.user.lastName ?? '',
              email: session.user.email || '',
              avatar
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
