/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { AuthContext } from '@/hooks/authContext';
import { request } from '@/lib/request';
import { getToken } from '@/lib/token';
import { useRouter } from 'next/router';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [_, setTrigger] = useState(0);
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();
  const token = getToken();

  const signin = useCallback((userToken: string, callback?: VoidFunction) => {
    setTrigger((i) => i + 1);
    localStorage.setItem('user_token', userToken);
    localStorage.removeItem('requestId');
    if (callback) callback();
  }, []);

  const signout = useCallback((callback?: VoidFunction) => {
    localStorage.removeItem('user_token');
    if (callback) {
      callback();
    }
  }, []);

  const fetcher = async () => {
    const res = await request({
      method: 'GET',
      url: '/api/current-user',
      headers: {
        Authorization: token?.accessToken,
      },
    });
    return res.data;
  };

  const {
    data: currentUser,
    isLoading: loadingCurrentUser,
  } = useSWR('api/user', fetcher);

  const [value, setValue] = useState({
    signin,
    signout,
    token: token.accessToken,
    userId,
    setUserId,
    currentUser,
    loadingCurrentUser,
  });

  if (!token || !token.accessToken || (!currentUser && !loadingCurrentUser)) {
    router.push('/login');
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
