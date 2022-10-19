import type { NextApiRequest, NextApiResponse } from 'next';
import { http } from '../../lib/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const data = req.headers;
    const { username, password } = data;
    try {
      const response = await http({
        headers: {
          username,
          password,
        },
        method: 'POST',
        url: '/api/v1/token',
      });
      console.log(response);
      res.status(200).json(response.data);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    // res.status(200).json({ name: 'John Doe' }),
    res.status(200).json({ name: 'Arthur Ming' });
  }
}
