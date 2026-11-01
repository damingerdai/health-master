import { getUserHeights } from '@/components/actions/user-heights';
import { HeightTable } from '@/components/height-table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { isErrorResponse } from '@/types/response';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';

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
  const result = await getUserHeights(page, PAGE_SIZE);

  if (!result || isErrorResponse(result)) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Unable to load weight records. Please try again.
      </p>
    );
  }

  const { data: userHeights, count } = result;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  if (page > totalPages) {
    redirect(`/height?page=${totalPages}`);
  }
  const offset = (page - 1) * PAGE_SIZE;
  const visiblePages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter(value => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-2">
        <h2 className="text-base font-medium tracking-tight text-stone-800 dark:text-stone-100">
          Recent Height Records
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Showing {count === 0 ? 0 : offset + 1}–{offset + userHeights.length}{' '}
          of {count} records
        </p>
      </div>
      <HeightTable userHeights={userHeights ?? []} />
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <Pagination aria-label="Height pagination" className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/height?page=${Math.max(1, page - 1)}`}
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
                    href={`/height?page=${pageNumber}`}
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
                href={`/height?page=${Math.min(totalPages, page + 1)}`}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
