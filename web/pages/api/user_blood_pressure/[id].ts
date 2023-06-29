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
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const resp = await httpClient.request({
        method: req.method,
        url: `/api/v1/user-blood-pressure/${id}`,
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      res.status(200).json(resp.data);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ error: `metho ${req.method} doesn't support` });
  }
}
