import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const ProtectRoute = WrappedComponent =>
  function Wrapper(props) {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    useEffect(() => {
      const checkToken = async () => {
        const token = localStorage.getItem('user_token');
        if (token) {
          setAuthenticated(true);
        } else {
          router.replace('/login');
          setAuthenticated(false);
        }
      };
      checkToken();
    }, []);

    if (authenticated) {
      return <WrappedComponent {...props} />;
    }
    return null;
  };
