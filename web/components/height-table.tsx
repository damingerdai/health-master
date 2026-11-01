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
import { UserHeights } from '@/types/user-height';
import { formatDate, isValid } from 'date-fns';
import Link from 'next/link';
import { PlusIcon, Ruler } from 'lucide-react';

interface HeightTableProps {
  userHeights: UserHeights;
}

const headClassName =
  'py-4 text-xs font-medium text-stone-500 dark:text-stone-400';

export const HeightTable: React.FC<HeightTableProps> = ({ userHeights }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white/85 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-900/70">
      <Table aria-label="Height records">
        <TableHeader className="bg-stone-50/60 dark:bg-stone-900/40">
          <TableRow className="border-stone-200/60 hover:bg-transparent dark:border-stone-800/70">
            <TableHead className={cn(headClassName, 'w-[120px] pl-8')}>
              Index
            </TableHead>
            <TableHead className={cn(headClassName, 'text-center')}>
              Height
            </TableHead>
            <TableHead className={cn(headClassName, 'pr-8 text-right')}>
              Logged At
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!userHeights || userHeights.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={3}
                className="h-[400px] whitespace-normal text-center"
              >
                <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    <div className="absolute -inset-4 animate-pulse rounded-full motion-reduce:animate-none bg-emerald-100/50 dark:bg-emerald-950/30" />
                    <div className="relative flex size-20 items-center justify-center rounded-full border border-emerald-800/15 bg-emerald-900/5 dark:border-emerald-500/20 dark:bg-emerald-950/30">
                      <Ruler
                        className="size-10 text-[#3F6254] dark:text-emerald-300"
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
                      Start tracking to gently follow your height over time.
                    </p>
                  </div>
                  <Link
                    href="/height-new"
                    className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl bg-[#3F6254] px-5 text-xs font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6254]/30 focus-visible:ring-offset-2"
                  >
                    <PlusIcon className="size-4" aria-hidden="true" />
                    <span>Add your first record</span>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            userHeights.map((item, index) => {
              const recordDate = item.recordDate
                ? new Date(item.recordDate)
                : null;
              return (
                <TableRow
                  key={item.id}
                  className="group border-stone-200/60 transition-colors hover:bg-stone-50/60 dark:border-stone-800/70 dark:hover:bg-stone-900/40"
                >
                  <TableCell className="py-5 pl-8 text-xs text-stone-400 dark:text-stone-500">
                    {index + 1}
                  </TableCell>

                  <TableCell className="py-5 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-base font-medium tracking-tight text-stone-800 dark:text-stone-100">
                        {item.height}{' '}
                        <span className="text-xs font-normal text-stone-400 dark:text-stone-500">
                          cm
                        </span>
                      </span>
                      <span className="text-[10px] font-normal text-stone-400 dark:text-stone-500">
                        Height
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-5 pr-8 text-right text-xs text-stone-500 dark:text-stone-400">
                    {recordDate && isValid(recordDate)
                      ? formatDate(recordDate, 'yyyy-MM-dd HH:mm')
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
