import type { NextApiRequest, NextApiResponse } from 'next'
import { http } from '../../lib/request';

type Data = {
  name?: string,
  token?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
        const data = await http({
            headers: {
                Authorization: req.headers.authorization
            },
            method: 'GET',
            url: '/api/v1/user'
        });
        res.status(200).json(data.data);
    } catch(err) {
        res.status(500).json(err);
    }
  } else {
    res.status(500).json({ error: 'only support get' });
  }
 
}