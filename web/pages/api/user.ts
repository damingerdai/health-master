import type { NextApiRequest, NextApiResponse } from 'next';
import { httpClient } from '@/lib/http-client';
import { DataResponse, isErrorResponse } from '@/type/response';
import { User } from '@/type/user';

/**
 * https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-the-edge-runtime
 */
export const runtime = process.env.RUNTIME === 'cloudflare' ? 'edge' : 'nodejs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const resp = await httpClient.request<DataResponse<User>>({
        headers: {
          ...req.headers,
          Authorization: req.headers.authorization,
        },
        method: 'GET',
        url: '/api/v1/user',
      });

      if (isErrorResponse(resp)) {
        if (resp.code === 10000006) {
          res.status(401).json(resp.message);
          return;
        }
        res.status(500).json(resp.message);
        return;
      }
      res.status(200).json(resp);
    } catch (err) {
      res.status(500).json(err);
    }
  } else if (req.method === 'POST') {
    try {
      const data = await httpClient.request<DataResponse<User>>({
        headers: {
          Authorization: req.headers.authorization,
        },
        method: 'POST',
        url: '/api/v1/user',
        data: req.body,
      });
      if (isErrorResponse(data)) {
        res.status(500).json(data.message);
      } else {
        res.status(200).json(data);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ error: 'only support get and post' });
  }
}
