'use client';

import { formatDate, isValid } from 'date-fns';
import { Ruler } from 'lucide-react';
import Link from 'next/link';
import { UserHeights } from '@/types/user-height';
import { buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export function HeightTable({ userHeights }: { userHeights: UserHeights }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <Table aria-label="Height records">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] py-5 pl-8">Index</TableHead>
            <TableHead className="py-5 text-center">Height</TableHead>
            <TableHead className="py-5 pr-8 text-right">Logged At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userHeights.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-[400px] whitespace-normal">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Ruler />
                    </EmptyMedia>
                    <EmptyTitle>No records yet</EmptyTitle>
                    <EmptyDescription>
                      Start tracking to monitor your height over time.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Link
                      href="/height-new"
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'sm'
                      })}
                    >
                      Add Your First Record
                    </Link>
                  </EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            userHeights.map((item, index) => {
              const recordDate = item.recordDate
                ? new Date(item.recordDate)
                : null;
              return (
                <TableRow key={item.id}>
                  <TableCell className="py-6 pl-8">
                    <span className="font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="py-6 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-lg font-bold tracking-tight">
                        {item.height}{' '}
                        <span className="text-xs font-normal text-muted-foreground">
                          cm
                        </span>
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        Height
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 pr-8 text-right">
                    <span className="text-sm text-muted-foreground">
                      {recordDate && isValid(recordDate)
                        ? formatDate(recordDate, 'yyyy-MM-dd HH:mm')
                        : 'Unknown'}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
