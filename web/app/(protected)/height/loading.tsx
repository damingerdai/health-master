import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export default function Loading() {
  return (
    <div role="status" aria-label="Loading height records" aria-busy="true">
      <span className="sr-only">Loading height records...</span>
      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="flex flex-wrap items-center justify-between gap-2 px-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-44" />
        </div>
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] py-5 pl-8">
                  <Skeleton className="h-5 w-12" />
                </TableHead>
                <TableHead className="py-5 text-center">
                  <Skeleton className="mx-auto h-5 w-16" />
                </TableHead>
                <TableHead className="py-5 pr-8 text-right">
                  <Skeleton className="ml-auto h-5 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }, (_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="py-6 pl-8">
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="py-6 text-center">
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-[15px] w-10" />
                    </div>
                  </TableCell>
                  <TableCell className="py-6 pr-8 text-right">
                    <Skeleton className="ml-auto h-5 w-32" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
