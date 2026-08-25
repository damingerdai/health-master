'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@base-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({
  className,
  checked,
  ...props
}: Omit<React.ComponentProps<typeof CheckboxPrimitive.Checkbox.Root>, 'checked'> & { checked?: boolean | 'indeterminate' }) {
  return (
    <CheckboxPrimitive.Checkbox.Root
      data-slot="checkbox"
      className={cn(
        'peer border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
      checked={checked === 'indeterminate' ? false : checked}
      indeterminate={checked === 'indeterminate'}
    >
      <CheckboxPrimitive.Checkbox.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Checkbox.Indicator>
    </CheckboxPrimitive.Checkbox.Root>
  );
}

export { Checkbox };
