import { httpClient } from '@/lib/http-client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const data = await  httpClient.request({
        method: 'POST',
        url: '/api/v1/user-blood-pressure',
        data: req.body,
        headers: {
          Authorization: req.headers.authorization,
        }
      });
      console.log(data);
      res.status(200).json(data.data);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ error: 'only support get' });
  }
}
