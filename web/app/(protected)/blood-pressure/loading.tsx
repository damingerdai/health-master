import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return <div className="flex h-[400px] w-full items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="large" className="text-primary" />
                      <p className="text-sm text-muted-foreground animate-pulse">Loading health data...</p>
                    </div>
                  </div>
}
