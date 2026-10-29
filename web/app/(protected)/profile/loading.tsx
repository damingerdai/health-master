import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const cardClassName =
  'rounded-3xl border-stone-200/70 bg-white/85 py-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:py-7 dark:border-stone-800/80 dark:bg-stone-900/70';

export default function Loading() {
  return (
    <div className="relative px-6 py-10 md:py-14">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        {/* Profile card skeleton */}
        <Card className={cardClassName}>
          <CardHeader className="flex flex-row items-center gap-4 border-b border-stone-200/60 px-6 pb-5 sm:px-7 dark:border-stone-800/70">
            <Skeleton className="size-16 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-32 max-w-full" />
              <Skeleton className="h-3.5 w-56 max-w-full" />
            </div>
          </CardHeader>

          <CardContent className="px-6 pt-5 sm:px-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2.5">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="border-t border-stone-200/60 px-6 pt-5 sm:px-7 dark:border-stone-800/70">
            <Skeleton className="h-10 w-32 rounded-xl" />
          </CardFooter>
        </Card>

        {/* Security card skeleton */}
        <Card className={cardClassName}>
          <CardHeader className="space-y-2 border-b border-stone-200/60 px-6 pb-5 sm:px-7 dark:border-stone-800/70">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3.5 w-64 max-w-full" />
          </CardHeader>
          <CardContent className="p-0">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index}>
                {index > 0 && (
                  <Separator className="bg-stone-200/60 dark:bg-stone-800/70" />
                )}
                <div className="flex items-center justify-between gap-6 px-6 py-5 sm:px-7">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <Skeleton className="mt-0.5 size-5 shrink-0" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-40 max-w-full" />
                        {index === 0 && (
                          <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
                        )}
                      </div>
                      <Skeleton className="h-3.5 w-72 max-w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-24 shrink-0 rounded-xl" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
