import type { NextApiRequest, NextApiResponse } from 'next';
import { isErrorResponse } from '@/type/response';
import { httpClient } from '@/lib/http-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === 'POST') {
      const headers = req.headers;
      const { username, password } = headers;
      const resp = await httpClient.login(username as string, password as string);
      if (isErrorResponse(resp)) {
        res.status(500).json(resp.message);
        return;
      }
      const { token, data } = resp;
      res.status(200).json({ code: 0, token, data});
    }
  } catch (err: any) {
    if (err.response?.data) {
      res.status(500).json(err.response.data.message);
    } else {
      res.status(500).json(err);
    }
  }
}