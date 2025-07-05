import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="felx flex-col gap-4 p-4 md:gap-6 md:Py-6">
          <div className="flex w-full justify-end">
            <Button>
              <Link href="/weight-new">Create a new weight record</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

