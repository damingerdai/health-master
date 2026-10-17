'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

interface NavUserProps {
  user: {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
    user.name?.[0]?.toUpperCase() ||
    'U';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="rounded-2xl border border-transparent px-2.5 py-2 transition-all duration-300 hover:border-stone-200/80 hover:bg-white/70 data-popup-open:border-stone-200/80 data-popup-open:bg-white/80 dark:hover:border-stone-800 dark:hover:bg-stone-900/70 dark:data-popup-open:bg-stone-900/80"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-xl border border-stone-200/80 dark:border-stone-700">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-xl bg-emerald-900/10 text-xs font-medium text-[#3F6254] dark:bg-emerald-950 dark:text-emerald-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-stone-800 dark:text-stone-100">
                {user.name}
              </span>
              <span className="truncate text-xs text-stone-500 dark:text-stone-400">
                {user.email}
              </span>
            </div>
            <IconDotsVertical className="ml-auto size-4 text-stone-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-2xl border-stone-200/80 bg-white/95 p-1.5 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.18)] backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-xl border border-stone-200/80 dark:border-stone-700">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-xl bg-emerald-900/10 text-xs font-medium text-[#3F6254] dark:bg-emerald-950 dark:text-emerald-300">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-stone-800 dark:text-stone-100">
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-stone-500 dark:text-stone-400">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-stone-200/70 dark:bg-stone-800" />
              <DropdownMenuItem
                render={<Link href="/profile" />}
                className="cursor-pointer rounded-xl px-2.5 py-2 text-stone-700 focus:bg-stone-100/80 focus:text-stone-900 dark:text-stone-300 dark:focus:bg-stone-800"
              >
                <IconUserCircle className="size-4 text-[#3F6254] dark:text-emerald-400" />
                <span>Personal Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-stone-200/70 dark:bg-stone-800" />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer rounded-xl px-2.5 py-2 text-stone-600 focus:bg-rose-50/70 focus:text-rose-700 dark:text-stone-400 dark:focus:bg-rose-950/40 dark:focus:text-rose-300"
              >
                <IconLogout className="size-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
