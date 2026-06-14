import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


export default function Loading() {
  return (
    <div className='space-y-8'>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />

              <Skeleton className="h-4 w-80" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-16 uppercase tracking-widest" />
                  <div className="h-10 pt-2 flex items-center border-b border-muted">
                    <Skeleton className="h-4 w-32 bg-muted/50" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Skeleton className="h-10 w-36 rounded-none" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}