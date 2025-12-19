import { BloodPressureTable } from "@/components/blood-pressure-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
          <div className="flex w-full justify-end">
            <Button asChild>
              <Link href="/blood-pressure-new">New Blood Pressue</Link>
            </Button>
          </div>
          <BloodPressureTable />
        </div>
      </div>
    </div>
  );
}

