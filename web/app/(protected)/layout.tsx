import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider
      className="text-stone-800 selection:bg-emerald-800/15 selection:text-emerald-950 [--sidebar:#F4EFE6] dark:text-stone-100 dark:[--sidebar:#141210]"
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 14)'
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="relative bg-[#FAF8F5] md:peer-data-[variant=inset]:m-2.5 md:peer-data-[variant=inset]:rounded-2xl md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-stone-200/80 md:peer-data-[variant=inset]:shadow-[0_8px_30px_-12px_rgba(120,113,108,0.1)] md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2.5 dark:bg-stone-950 dark:md:peer-data-[variant=inset]:border-stone-800/80">
        <SiteHeader />
        <div className="relative flex flex-1 flex-col overflow-x-hidden">
          {/* Soft diffused ambient light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-1/4 -z-10 h-72 w-96 rounded-full bg-amber-100/35 blur-3xl dark:bg-emerald-950/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-1/4 -z-10 h-72 w-96 rounded-full bg-emerald-100/25 blur-3xl dark:bg-stone-900/40"
          />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
