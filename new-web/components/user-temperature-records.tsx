"use client";
import { useState, useEffect, useTransition } from "react";
import { request } from "@/lib/request";
import { UserTemperatures } from "@/types/user-temperature";
import { formatDate } from "date-fns";
import { Spinner } from "./ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const UserTemperatureRecords = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [records, setRecords] = useState<UserTemperatures>([]);
  const loadUserTemperatureRecords = async () => {
    try {
      const res = await request<{
        code: number;
        data: UserTemperatures;
      }>({
        method: "GET",
        url: "/api/user-temperatures",
      });

      console.log("res", res);
      if (res.data && res?.data) {
        return res.data;
      }
    } catch (error) {
      const apiError = error as { code: number; message?: string };
      if (apiError?.message) {
        toast.error(apiError?.message);
      }
      if (apiError?.code < 20000000) {
        router.push("/sign-in?callbackUrl=/temperature");
      }
    }

    return [];
  };

  useEffect(() => {
    startTransition(async () => {
      const records = await loadUserTemperatureRecords();
      setRecords(records);
    });
  }, []);

  return (
    <div className="border rounded-md">
      {isPending && (
        <div className="min-h-12">
          <Spinner />
        </div>
      )}
      {!isPending && records.length === 0 && (
        <Table>
          <TableCaption>
            <div className="p-4">No temperature records found.</div>
          </TableCaption>
        </Table>
      )}
      {!isPending && records.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Record Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.user?.username}</TableCell>
                <TableCell
                  className={cn({
                    "text-red-500":
                      (item.unit === "C" && item.temperature > 38.0) ||
                      (item.unit === "F" && item.temperature > 100),
                  })}
                >
                  {item.temperature}°{item.unit}
                </TableCell>
                <TableCell>
                  {item.recordDate
                    ? formatDate(item.recordDate, "yyyy-MM-mm hh:mm")
                    : "unkdown date"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
