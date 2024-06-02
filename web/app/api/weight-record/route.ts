import { httpClient } from '@/lib/http-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const data = await req.json();
    const authorization = req.headers.get('Authorization');
    try {
        const resp = await httpClient.request({
            method: 'POST',
            url: '/api/v1/weight-record',
            data,
            headers: {
                Authorization: authorization,
            },
        });

        return NextResponse.json(resp.data);
    } catch (err) {
        return NextResponse.json(err, { status: 500 });
    }
}
