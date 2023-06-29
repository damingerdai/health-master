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
  if (req.method === 'POST') {
    try {
      const data = await httpClient.request({
        method: 'POST',
        url: '/api/v1/user-blood-pressure',
        data: req.body,
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      res.status(200).json(data.data);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ error: `metho ${req.method} doesn't support` });
  }
}
