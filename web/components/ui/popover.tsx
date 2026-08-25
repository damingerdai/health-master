'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@base-ui/react/popover';

import { cn } from '@/lib/utils';

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popover.Root>) {
  return <PopoverPrimitive.Popover.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ asChild, children, ...props }: React.ComponentProps<typeof PopoverPrimitive.Popover.Trigger> & { asChild?: boolean }) {
  return <PopoverPrimitive.Popover.Trigger data-slot="popover-trigger" render={asChild ? children as React.ReactElement : undefined} {...props}>{asChild ? null : children}</PopoverPrimitive.Popover.Trigger>;
}

function PopoverContent({
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popover.Popup> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}) {
  return (
    <PopoverPrimitive.Popover.Portal>
      <PopoverPrimitive.Popover.Positioner side={side} align={align} sideOffset={sideOffset}>
      <PopoverPrimitive.Popover.Popup
        data-slot="popover-content"
        className={cn(
          'bg-popover text-popover-foreground data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 z-50 w-72 origin-(--transform-origin) rounded-md border p-4 shadow-md outline-hidden transition',
          className
        )}
        {...props}
      />
      </PopoverPrimitive.Popover.Positioner>
    </PopoverPrimitive.Popover.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent };
