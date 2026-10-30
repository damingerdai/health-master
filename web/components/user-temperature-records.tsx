'use client';

import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { UserTemperatures } from '@/types/user-temperature';
import { formatDate } from 'date-fns';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { PlusIcon, Thermometer } from 'lucide-react';

interface UserTemperatureRecordsProps {
  userTemperatures: UserTemperatures;
}

const headClassName =
  'py-4 text-xs font-medium text-stone-500 dark:text-stone-400';

export const UserTemperatureRecords = ({
  userTemperatures
}: UserTemperatureRecordsProps) => {
  const getTemperatureStatus = (temp: number, unit: string) => {
    const isCelsius = unit === 'C';
    const feverThreshold = isCelsius ? 38.0 : 100.4;
    const lowThreshold = isCelsius ? 36.0 : 96.8;

    if (temp >= feverThreshold)
      return {
        label: 'Fever',
        color:
          'text-rose-700 bg-rose-50/70 border-rose-200/80 dark:text-rose-300 dark:bg-rose-950/40 dark:border-rose-900/50'
      };
    if (temp < lowThreshold)
      return {
        label: 'Low',
        color:
          'text-amber-700 bg-amber-50/80 border-amber-200/80 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-900/50'
      };
    return {
      label: 'Normal',
      color:
        'text-[#3F6254] bg-emerald-900/5 border-emerald-700/20 dark:text-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-500/30'
    };
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white/85 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-900/70">
      <Table>
        <TableHeader className="bg-stone-50/60 dark:bg-stone-900/40">
          <TableRow className="border-stone-200/60 hover:bg-transparent dark:border-stone-800/70">
            <TableHead className={cn(headClassName, 'w-[120px] pl-8')}>
              Index
            </TableHead>
            <TableHead className={headClassName}>Status</TableHead>
            <TableHead className={cn(headClassName, 'text-center')}>
              Temperature
            </TableHead>
            <TableHead className={cn(headClassName, 'pr-8 text-right')}>
              Logged At
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!userTemperatures || userTemperatures.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="h-[400px] text-center">
                <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    <div className="absolute -inset-4 animate-pulse rounded-full bg-amber-100/50 dark:bg-amber-950/20" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-amber-200/70 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40">
                      <Thermometer
                        className="h-10 w-10 text-amber-600 dark:text-amber-400"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="mx-auto max-w-[280px] space-y-2">
                    <h3 className="text-lg font-medium text-stone-800 dark:text-stone-100">
                      No records yet
                    </h3>
                    <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                      Start tracking to gently watch your natural warmth.
                    </p>
                  </div>
                  <Link
                    href="/temperature-new"
                    className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl bg-[#3F6254] px-5 text-xs font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
                  >
                    <PlusIcon className="size-4" aria-hidden="true" />
                    <span>Add your first record</span>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            userTemperatures?.map((item, index) => {
              const status = getTemperatureStatus(item.temperature, item.unit);
              const isFever =
                (item.unit === 'C' && item.temperature >= 38.0) ||
                (item.unit === 'F' && item.temperature >= 100.4);
              return (
                <TableRow
                  key={item.id}
                  className="group border-stone-200/60 transition-colors hover:bg-stone-50/60 dark:border-stone-800/70 dark:hover:bg-stone-900/40"
                >
                  <TableCell className="py-5 pl-8 text-xs text-stone-400 dark:text-stone-500">
                    {index + 1}
                  </TableCell>

                  <TableCell className="py-5">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                        status.color
                      )}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-5 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={cn(
                          'text-base font-medium tracking-tight transition-colors',
                          isFever
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-stone-800 dark:text-stone-100'
                        )}
                      >
                        {item.temperature}°{item.unit}
                      </span>
                      <span className="text-[10px] font-normal text-stone-400 dark:text-stone-500">
                        Temperature
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-5 pr-8 text-right text-xs text-stone-500 dark:text-stone-400">
                    {item.recordDate
                      ? formatDate(
                          new Date(item.recordDate),
                          'yyyy-MM-dd HH:mm'
                        )
                      : 'Unknown'}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
