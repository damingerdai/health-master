import { getUserBloodPressures } from '@/components/actions/user-blood-pressure';
import { BloodPressureTable } from '@/components/blood-pressure-table';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Fragment } from 'react';
import { redirect } from 'next/navigation';

const PAGE_SIZE = 20;

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page: rawPage } = await searchParams;
  const parsedPage = typeof rawPage === 'string' ? Number(rawPage) : 1;
  const page =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const result = await getUserBloodPressures(page, PAGE_SIZE);

  if (!result) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Unable to load blood pressure records. Please try again.
      </p>
    );
  }

  const { data: bloodPressures, count } = result;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  if (page > totalPages) {
    redirect(`/blood-pressure?page=${totalPages}`);
  }
  const offset = (page - 1) * PAGE_SIZE;
  const visiblePages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter(value => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-base font-medium tracking-tight text-stone-800 dark:text-stone-100">
          Recent Blood Pressure Records
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Showing {count === 0 ? 0 : offset + 1}–
          {offset + bloodPressures.length} of {count} records
        </p>
      </div>
      <div className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white/85 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-900/70">
        <BloodPressureTable bloodPressures={bloodPressures} offset={offset} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <Pagination
          aria-label="Blood pressure pagination"
          className="mx-0 w-auto"
        >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/blood-pressure?page=${Math.max(1, page - 1)}`}
                disabled={page === 1}
              />
            </PaginationItem>
            {visiblePages.map((pageNumber, index) => (
              <Fragment key={pageNumber}>
                {index > 0 && pageNumber - visiblePages[index - 1] > 1 ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <PaginationLink
                    href={`/blood-pressure?page=${pageNumber}`}
                    isActive={pageNumber === page}
                    aria-label={`Go to page ${pageNumber}`}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`/blood-pressure?page=${Math.min(totalPages, page + 1)}`}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
