import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-8 w-48 max-w-full" />
              <Skeleton className="h-5 w-80 max-w-full" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid gap-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="h-9 flex items-center border-b border-input">
                    <Skeleton className="h-4 w-32 max-w-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Skeleton className="h-9 w-48 max-w-full rounded-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-64 max-w-full" />
        </CardHeader>
        <CardContent className="p-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              {index > 0 && <Separator />}
              <div className="flex items-center justify-between gap-6 px-6 py-5">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <Skeleton className="mt-1 size-5 shrink-0" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-40 max-w-full" />
                      {index === 0 && (
                        <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
                      )}
                    </div>
                    <Skeleton className="h-5 w-80 max-w-full" />
                  </div>
                </div>
                <Skeleton
                  className={
                    index === 0 ? 'h-9 w-20 shrink-0' : 'h-9 w-28 shrink-0'
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
