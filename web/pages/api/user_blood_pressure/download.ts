import { httpClient } from '@/lib/http-client';
import type { NextApiRequest, NextApiResponse } from 'next';

const baseURL = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body;
      //   const { authorization } = req.headers;
      //   let token = authorization;
      //   if (authorization?.startsWith("Bearer ")) {
      //     token = authorization?.substring(7);
      //   }
      //   if (!token) {
      //     res.status(403).json({
      //         error: 'token is not exist'
      //     });
      //   }
      const { data } = await httpClient.request({
        method: 'POST',
        url: '/api/v1/tmptoken',
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      const { accessToken } = data;
      const downloadUrl = `${baseURL}/api/v1/user-blood-pressure/${userId}/export?accessToken=${accessToken}`;

      res.status(200).json({
        downloadUrl,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(500).json({ error: `method ${req.method} doesn't support` });
  }
}
