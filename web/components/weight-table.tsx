'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { WeightRecord, WeightRecords } from '@/types/weight-record';
import { request } from '@/lib/request';
import { formatDate } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { buttonVariants } from './ui/button';
import Link from 'next/link';
import { Scale } from 'lucide-react';

const TablePlaceholder = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

interface WeightTableProps {
  userWeights: WeightRecords;
}

export const WeightTable: React.FC<WeightTableProps> = ({ userWeights }) => {

  const getWeightStatus = (weight: number) => {
    // Basic status logic, can be refined based on user profile (BMI)
    if (weight > 100)
      return {
        label: 'Overweight',
        color: 'text-amber-600 bg-amber-50 border-amber-200'
      };
    if (weight < 50)
      return {
        label: 'Underweight',
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      };
    return {
      label: 'Normal',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    };
  };

  return (
    <div className="rounded-2xl border bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-zinc-900 dark:shadow-none overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/40">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-[120px] py-5 pl-8 font-semibold uppercase tracking-wider text-[11px]">
              Index
            </TableHead>
            <TableHead className="py-5">Status</TableHead>
            <TableHead className="py-5 text-center">Weight</TableHead>
            <TableHead className="py-5 text-right pr-8">Logged At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!userWeights || userWeights.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-[400px] text-center">
                <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-blue-100/50 dark:bg-blue-900/10 animate-pulse" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <Scale
                        className="h-10 w-10 text-blue-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-[280px] mx-auto">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      No records yet
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Start tracking to monitor your health trends.
                    </p>
                  </div>
                  <Link
                    href="/weight-new"
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                      className: 'mt-2'
                    })}
                  >
                    Add Your First Record
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            userWeights.map((item, index) => {
              const status = getWeightStatus(item.weight);
              return (
                <TableRow key={item.id} className="group transition-colors">
                  <TableCell className="py-6 pl-8 font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  <TableCell className="py-6">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-sm',
                        status.color
                      )}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-6 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-200">
                        {item.weight}{' '}
                        <span className="text-xs font-normal text-muted-foreground">
                          kg
                        </span>
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal uppercase">
                        Weight
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-6 text-right pr-8 text-sm text-muted-foreground">
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
