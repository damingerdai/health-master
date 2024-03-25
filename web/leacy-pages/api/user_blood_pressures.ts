import { httpClient } from '@/lib/http-client';
import type { NextApiRequest, NextApiResponse } from 'next';

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
      const result = await httpClient.request({
        method: 'GET',
        url: '/api/v1/user-blood-pressures',
        headers: {
          Authorization: req.headers.authorization,
        },
        params: req.query,
      });
      if (result.data && !result?.data?.data) {
        result.data.data = [];
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(422).json({ error: `method ${req.method} doesn't support` });
  }
}
