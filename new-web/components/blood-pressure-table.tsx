"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { UserBloodPressures } from "@/types/user-blood-pressure";
import { request } from "@/lib/request";
import { formatDate } from "date-fns";

export const BloodPressureTable: React.FC = () => {
  const [bloodPressures, setBloodPressures] = useState<UserBloodPressures>([]);
  const loadBloodPressues = async () => {
    const res = await request<{
      code: number;
      data: { data: UserBloodPressures };
    }>({
      url: "/api/user-blood-pressures",
    });
    setBloodPressures(res.code === 200 ? res.data.data : []);
  };

  useEffect(() => {
    loadBloodPressues();
  }, []);

  return (
    <div className="border rounded-md">
      <Table>
        <TableCaption>A list of you bloold pressue</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Systolic Blood Pressure</TableHead>
            <TableCell>Diastolic Blood Pressure</TableCell>
            <TableCell>Log Date</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bloodPressures.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.user?.username}</TableCell>
              <TableCell>{item.systolicBloodPressure}</TableCell>
              <TableCell>{item.diastolicBloodPressure}</TableCell>
              <TableCell>
                {item.logDatetime
                  ? formatDate(item.logDatetime, "yyyy-MM-mm hh:mm")
                  : "unkdown date"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
