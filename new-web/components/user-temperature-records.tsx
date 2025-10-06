"use client";
import { useState, useEffect } from "react";
import { request } from "@/lib/request";

export const UserTemperatureRecords = () => {
    const [records, setRecords] = useState<any[]>([]);
     const loadUserTemperatureRecords = async () => {
        const res= await request({
            method: 'GET',
            url: '/api/user-temperatures',})
        if (res.data && res?.data?.data) {
            return res.data.data;
        }   
        return [];
    };

    useEffect(() => {
        loadUserTemperatureRecords().then(data => setRecords(data));    
    })

    console.log("records", records);

    // const records = use(loadUserTemperatureRecords());
    // console.log("records", records);
  return <div>User Temperature Records Component</div>;
}