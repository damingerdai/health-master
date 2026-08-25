'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@base-ui/react/tooltip';

import { cn } from '@/lib/utils';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Tooltip.Provider> & { delayDuration?: number }) {
  return (
    <TooltipPrimitive.Tooltip.Provider
      data-slot="tooltip-provider"
      delay={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Tooltip.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Tooltip.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Tooltip.Trigger> & { asChild?: boolean }) {
  return <TooltipPrimitive.Tooltip.Trigger data-slot="tooltip-trigger" render={asChild ? children as React.ReactElement : undefined} {...props} />;
}

function TooltipContent({
  className,
  side = 'top',
  align = 'center',
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Tooltip.Popup> & {
  side?: 'top' | 'right' | 'bottom' | 'left'; align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}) {
  return (
    <TooltipPrimitive.Tooltip.Portal>
      <TooltipPrimitive.Tooltip.Positioner side={side} align={align} sideOffset={sideOffset}>
      <TooltipPrimitive.Tooltip.Popup
        data-slot="tooltip-content"
        className={cn(
          'bg-primary text-primary-foreground data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 z-50 w-fit origin-(--transform-origin) rounded-md px-3 py-1.5 text-xs text-balance transition',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Tooltip.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Tooltip.Popup>
      </TooltipPrimitive.Tooltip.Positioner>
    </TooltipPrimitive.Tooltip.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
