import { httpClient } from '@/lib/http-client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const data = await httpClient.request({
        method: 'GET',
        url: '/api/v1/user-blood-pressures',
        headers: {
          Authorization: req.headers.authorization,
        },
        params: req.query,
      });
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ error: 'only support get' });
  }
}
