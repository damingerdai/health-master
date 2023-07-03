import { AccessToken } from '@/type/token';

export const getToken = () => {
  try {
    const userTokenStr = localStorage.getItem('user_token');
    const userToken = JSON.parse(userTokenStr ?? '') as AccessToken;
    return userToken;
  } catch (err) {
    return { accessToken: '' } as AccessToken;
  }
};
