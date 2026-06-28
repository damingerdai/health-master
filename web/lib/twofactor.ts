"use server";
import { Verify2FARequest } from "@/types/request";
import { DataResponse } from "@/types/response";
import { AccessToken } from "@/types/token";

export async function verify2FA(req: Verify2FARequest): Promise<DataResponse<AccessToken>> {
  return fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/auth/login/2fa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req)
  }).then(async (res) => {
    const data = await res.json();
    return data;
  });
}