'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { fetchWeightRecord } from '@/lib/featcher';
import { isErrorResponse } from '@/types/response';
import { format } from 'date-fns';

export const WeightTable: React.FC = () => {
  const [page] = useState({ pageNo: 1, pageSize: 5 });
  const { data } = useSWR({ url: 'api/weight-records', args: page }, () =>
    fetchWeightRecord({ ...page })
  );
  const weightRecords = useMemo(() => {
    if (!data) return [];
    if (isErrorResponse(data)) {
      return [];
    }
    return data.data ?? [];
  }, [data]);

  return (
    <div className="border rounded- md">
      <Table>
        <TableCaption>A list of your weight records </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Record Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weightRecords.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                {item.user.firstName} {item.user.lastName}
              </TableCell>
              <TableCell>{item.weight}</TableCell>
              <TableCell>
                {item.recordDate
                  ? format(item.recordDate, 'PPP')
                  : 'unkdown date'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
