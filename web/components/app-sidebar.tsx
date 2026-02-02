'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import {
  IconInnerShadowTop,
  IconLoader3,
} from '@tabler/icons-react';
import { 
  LayoutDashboard, 
  Activity, 
  Scale, 
  Thermometer 
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


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const items = [
    {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Blood Pressure',
    url: '/blood-pressure',
    icon: Activity,
  },
  {
    title: 'Weight',
    url: '/weight',
    icon: Scale,
  },
  {
    title: 'Temperature',
    url: '/temperature',
    icon: Thermometer,
  }
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Health Master</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {status === 'loading' && (
        <div className="p-4">
          <IconLoader3 className="m-auto animate-spin" />
        </div>
      )}
      {status === 'authenticated' && session?.user && (
        <SidebarFooter>
          <NavUser
            user={{
              name: session.user.firstName + ' ' + session.user.lastName ||  session.user.username || 'User',
              email: session.user.email || '',
              avatar: session.user.image || '/avatars/shadcn.jpg'
            }}
          />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
