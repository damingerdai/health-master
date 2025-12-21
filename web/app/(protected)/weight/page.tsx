import { Button } from '@/components/ui/button';
import { WeightTable } from '@/components/weight-table';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
          <div className="flex w-full justify-end">
            <Button>
              <Link href="/weight-new">New weight record</Link>
            </Button>
          </div>
          <WeightTable />
        </div>
      </div>
    </div>
  );
}
