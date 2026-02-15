'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { UserBloodPressures } from '@/types/user-blood-pressure';
import { request } from '@/lib/request';
import { formatDate } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';
import { Activity, HeartPulse } from 'lucide-react';


const TablePlaceholder = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

export const BloodPressureTable: React.FC = () => {
  const [bloodPressures, setBloodPressures] = useState<UserBloodPressures>([]);
  const [loading, setLoading] = useState(true);
  const loadBloodPressures = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request<{
        code: number;
        data: { data: UserBloodPressures };
      }>({ url: '/api/user-blood-pressures' });

      setBloodPressures(res.code === 200 ? res.data.data : []);
    } catch (error) {
      console.error('Failed to fetch blood pressure:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatus = (sys: number, dia: number) => {
    if (sys >= 140 || dia >= 90) return { label: 'High', color: 'text-red-600 bg-red-50 border-red-200' };
    if (sys < 90 || dia < 60) return { label: 'Low', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  useEffect(() => {
    loadBloodPressures();
  }, [loadBloodPressures]);

  if (loading) return <TablePlaceholder />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold tracking-tight">Recent Blood Pressure Records</h2>
        <p className="text-sm text-muted-foreground">Showing last 20 records</p>
      </div>
      <div className="rounded-2xl border bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-zinc-900 dark:shadow-none overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/40">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[120px] py-5 pl-8 font-semibold uppercase tracking-wider text-[11px]">Index</TableHead>
              <TableHead className="py-5">Health Status</TableHead>
              <TableHead className="py-5 text-center">Systolic</TableHead>
              <TableHead className="py-5 text-center">Diastolic</TableHead>
              <TableHead className="py-5 text-right pr-8">Logged At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bloodPressures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
                      <HeartPulse className="h-8 w-8 text-rose-500" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">No records yet</p>
                      <p className="text-sm text-muted-foreground">
                        Start tracking your blood pressure to see your health trends.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="mt-2">
                      <Link href="/blood-pressure-new">Add Your First Record</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bloodPressures.map((item, index) => {
                const status = getStatus(item.systolicBloodPressure, item.diastolicBloodPressure);
                const isSysHigh = item.systolicBloodPressure >= 140;
                const isDiaHigh = item.diastolicBloodPressure >= 90;
                return (
                  <TableRow key={item.id} className="group transition-colors">
                    <TableCell className="py-6 pl-8 font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell className="py-6">
                      <Badge variant="secondary" className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-sm", status.color)}>
                        {status.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={cn(
                          "text-lg font-bold tracking-tight transition-colors",
                          isSysHigh ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-200"
                        )}>
                          {item.systolicBloodPressure}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-normal uppercase">Systolic</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={cn(
                          "text-lg font-bold tracking-tight transition-colors",
                          isDiaHigh ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-200"
                        )}>
                          {item.diastolicBloodPressure}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-normal uppercase">Diastolic</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-6 text-right pr-8 text-sm text-muted-foreground">
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
      </div>
    </div>
  );
};
