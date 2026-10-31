'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { UserBloodPressures } from '@/types/user-blood-pressure';
import { formatDate } from 'date-fns';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { HeartPulse, PlusIcon } from 'lucide-react';

interface BloodPressureTableProps {
  bloodPressures: UserBloodPressures;
  offset?: number;
}

const headClassName =
  'py-4 text-xs font-medium text-stone-500 dark:text-stone-400';

export const BloodPressureTable: React.FC<BloodPressureTableProps> = ({
  bloodPressures,
  offset = 0
}) => {
  const getStatus = (sys: number, dia: number) => {
    if (sys >= 140 || dia >= 90)
      return {
        label: 'High',
        color:
          'text-rose-700 bg-rose-50/70 border-rose-200/80 dark:text-rose-300 dark:bg-rose-950/40 dark:border-rose-900/50'
      };
    if (sys < 90 || dia < 60)
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
    <Table>
      <TableHeader className="bg-stone-50/60 dark:bg-stone-900/40">
        <TableRow className="border-stone-200/60 hover:bg-transparent dark:border-stone-800/70">
          <TableHead className={cn(headClassName, 'w-[120px] pl-8')}>
            Index
          </TableHead>
          <TableHead className={headClassName}>Health Status</TableHead>
          <TableHead className={cn(headClassName, 'text-center')}>
            Systolic
          </TableHead>
          <TableHead className={cn(headClassName, 'text-center')}>
            Diastolic
          </TableHead>
          <TableHead className={cn(headClassName, 'pr-8 text-right')}>
            Logged At
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bloodPressures.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={5} className="h-[400px] text-center">
              <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute -inset-4 animate-pulse rounded-full bg-rose-100/50 dark:bg-rose-900/10" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-rose-100 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20">
                    <HeartPulse
                      className="h-10 w-10 text-rose-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="mx-auto max-w-[280px] space-y-2">
                  <h3 className="text-lg font-medium text-stone-800 dark:text-stone-100">
                    No readings yet
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                    Start tracking to gently monitor your heart trends.
                  </p>
                </div>
                <Link
                  href="/blood-pressure-new"
                  className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl bg-[#3F6254] px-5 text-xs font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
                >
                  <PlusIcon className="size-4" aria-hidden="true" />
                  <span>Add your first record</span>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          bloodPressures.map((item, index) => {
            const status = getStatus(
              item.systolicBloodPressure,
              item.diastolicBloodPressure
            );
            const isSysHigh = item.systolicBloodPressure >= 140;
            const isDiaHigh = item.diastolicBloodPressure >= 90;
            return (
              <TableRow
                key={item.id}
                className="group border-stone-200/60 transition-colors hover:bg-stone-50/60 dark:border-stone-800/70 dark:hover:bg-stone-900/40"
              >
                <TableCell className="py-5 pl-8 text-xs text-stone-400 dark:text-stone-500">
                  {offset + index + 1}
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
                        isSysHigh
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-stone-800 dark:text-stone-100'
                      )}
                    >
                      {item.systolicBloodPressure}
                    </span>
                    <span className="text-[10px] font-normal text-stone-400 dark:text-stone-500">
                      Systolic
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-5 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span
                      className={cn(
                        'text-base font-medium tracking-tight transition-colors',
                        isDiaHigh
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-stone-800 dark:text-stone-100'
                      )}
                    >
                      {item.diastolicBloodPressure}
                    </span>
                    <span className="text-[10px] font-normal text-stone-400 dark:text-stone-500">
                      Diastolic
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-5 pr-8 text-right text-xs text-stone-500 dark:text-stone-400">
                  {item.logDatetime
                    ? formatDate(new Date(item.logDatetime), 'yyyy-MM-dd HH:mm')
                    : 'Unknown'}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
