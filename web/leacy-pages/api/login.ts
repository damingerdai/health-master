import type { NextApiRequest, NextApiResponse } from 'next';
import { isErrorResponse } from '@/type/response';
import { httpClient } from '@/lib/http-client';

/**
 * https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-the-edge-runtime
 */
export const runtime = process.env.RUNTIME === 'cloudflare' ? 'edge' : 'nodejs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === 'POST') {
      const { headers } = req;
      const { username, password } = headers;
      const resp = await httpClient.login(
        username as string,
        password as string,
      );
      if (isErrorResponse(resp)) {
        res.status(500).json({ code: -1, message: resp.message });
        return;
      }
      const { token, data } = resp;
      res.status(200).json({ code: 0, token, data });
    } else {
      res.status(500).json({ error: `method ${req.method} doesn't support` });
    }
  } catch (err: any) {
    if (err.response?.data) {
      res.status(500).json({ code: -1, message: err.response.data.message });
    } else {
      res.status(500).json({ code: -1, message: err });
    }
  }
}
