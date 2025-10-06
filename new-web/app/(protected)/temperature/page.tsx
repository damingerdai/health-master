import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { UserTemperatureRecords } from "@/components/user-temperature-records";
 
import Link from "next/link";
import React from "react";

export default function Page() {

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex w-full items-center justify-between border-b px-4 py-2 md:px-6 md:py-">
                <Breadcrumb className="w-full">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Temperature</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
                    <div className="flex w-full justify-end">
                        <Button asChild>
                            <Link href="/temperature-new">New Temperature</Link>
                        </Button>
                    </div>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <UserTemperatureRecords />
                    </React.Suspense>
                </div>
            </div>
        </div>
    );
}
