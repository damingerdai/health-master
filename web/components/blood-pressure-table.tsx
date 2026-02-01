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
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-zinc-900">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/50">
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Systolic (mmHg)</TableHead>
            <TableHead>Diastolic (mmHg)</TableHead>
            <TableHead className="text-right">Logged At</TableHead>
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
            bloodPressures.map((item) => {
              const status = getStatus(item.systolicBloodPressure, item.diastolicBloodPressure);
              return (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">#{item.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium", status.color)}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn("font-semibold", item.systolicBloodPressure >= 140 && "text-red-500")}>
                    {item.systolicBloodPressure}
                  </TableCell>
                  <TableCell className={cn("font-semibold", item.diastolicBloodPressure >= 90 && "text-red-500")}>
                    {item.diastolicBloodPressure}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
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
  );
};
