import { type ComponentProps, useState } from 'react';

import { cn } from '@/lib/utils';

type OtpInputProps = Omit<
  ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'maxLength'
> & {
  value?: string;
  onChange: (value: string) => void;
  slotClassName?: string;
};

/** Six-character alphanumeric code input. className styles the slot container. */
export function OtpInput({
  value = '',
  onChange,
  className,
  slotClassName,
  onFocus,
  onBlur,
  ...props
}: OtpInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const activeIndex = Math.min(value.length, 5);

  return (
    <div
      className={cn(
        'relative grid w-full max-w-[288px] grid-cols-6 gap-2 sm:flex sm:w-fit sm:max-w-none sm:gap-6',
        className
      )}
    >
      <input
        inputMode="text"
        autoComplete="one-time-code"
        autoCapitalize="none"
        aria-label="6-character verification code"
        {...props}
        type="text"
        value={value}
        maxLength={6}
        className="absolute inset-0 z-10 size-full cursor-text opacity-0"
        onFocus={event => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onChange={event => {
          onChange(event.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6));
        }}
      />
      {Array.from({ length: 6 }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            'flex h-12 min-w-0 items-center justify-center rounded-xl border-2 border-[#D8D8D8] bg-white text-xl font-medium leading-none sm:h-20 sm:w-16 sm:rounded-2xl sm:text-[28px]',
            slotClassName,
            isFocused && index === activeIndex && 'border-[#1976D2]'
          )}
        >
          {value[index] ?? ''}
        </span>
      ))}
    </div>
  );
}
