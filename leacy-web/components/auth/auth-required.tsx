'use client';

import { Box } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { getToken } from '@/lib/token';
import { request } from '@/lib/request';
import { userAtom } from '@/store/user';
import { useSetAtom } from 'jotai';
import { GlobalLoading } from '../loading';

export const AuthRequired: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const setUserAtom = useSetAtom(userAtom);
  const pathname = usePathname();
  const router = useRouter();
  const token = getToken();
  const [loading, setLoading] = useState(true);

  const fetcher = useCallback(async () => {
    const res = await request({
      method: 'GET',
      url: '/api/current-user',
      headers: {
        Authorization: token?.accessToken,
      },
    });
    setLoading(false);
    if (res.code === 200) {
      setUserAtom(res.data);
    } else {
      router.push('/login');
    }

    return res.data;
  }, [router, setUserAtom, token?.accessToken]);

  useEffect(() => {
    if (pathname === '/login') {
      return;
    }

    fetcher();
  }, [fetcher, pathname]);

  if (loading) {
    return (
      <Box p={4}>
        <GlobalLoading />
      </Box>
    );
  }

  return children;
};
