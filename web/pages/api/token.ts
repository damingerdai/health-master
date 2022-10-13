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
  if (req.method === 'POST') {
    const data = req.headers;
    const { username, password } = data;
    try {
        const data = await http({
            headers: {
                username,
                password
            },
            method: 'POST',
            url: '/api/v1/token'
        })
        console.log(data.data);
        res.status(200).json(data.data)
    } catch(err) {
        res.status(500).json(err);
    }
  } else [
    res.status(200).json({ name: 'John Doe' })
  ]
 
}