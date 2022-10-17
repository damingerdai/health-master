import type { NextApiRequest, NextApiResponse } from 'next'
import { http } from '../../lib/request';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === 'POST') {
      try {
          const data = await http({
              method: 'POST',
              url: '/api/v1/user-blood-pressure',
              data: req.body
          });
          res.status(200).json(data.data);
      } catch(err) {
          res.status(500).json(err);
      }
    } else {
      res.status(500).json({ error: 'only support get' });
    }
   
  }