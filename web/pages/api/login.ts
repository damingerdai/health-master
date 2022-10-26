import type { NextApiRequest, NextApiResponse } from 'next';
import { http } from '@/lib/request';
import { DataResponse, isErrorResponse, TokenResponse } from '@/type/response';
import { User } from '@/type/user';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    try {
      if (req.method === 'POST') {
        const data = req.headers;
        const { username, password } = data;
        const response = await http<TokenResponse>({
          headers: {
            username,
            password,
          },
          method: 'POST',
          url: '/api/v1/token',
        });
        if (isErrorResponse(response)) {
          res.status(400).json(response.error);
          return;
        }
        const { accessToken } = response.token;
        const userResponse = await http<DataResponse<User>>(
          {
            headers: {
              Authorization: accessToken,
            },
            method: 'GET',
            url: '/api/v1/user',
          }
        )
        if (isErrorResponse(userResponse)) {
          res.status(400).json(userResponse.error);
          return;
        }
        res.status(200).json({
          token: accessToken,
          user: userResponse.data
        })
        // localStorage.setItem('user_token', accessToken);
      }
    } catch (err) {
      res.status(500).json(err);
    }
   
}