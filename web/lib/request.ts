import { AccessToken } from '@/type/token';
import { User } from '@/type/user';
import axios, { AxiosRequestConfig } from 'axios';
import { toastInstance } from '../components/toast';

const fclient = axios.create({
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

fclient.interceptors.request.use((config) => {
  const tokenString = localStorage.getItem('user_token');
  if (tokenString) {
    // eslint-disable-next-line no-param-reassign
    config!.headers!.Authorization = `Bearer ${tokenString}`;
  }

  return config;
});

fclient.interceptors.response.use((response) => {
  const { status } = response;
  if ((status < 200 || (status >= 300 && status !== -302)) && !toastInstance.isActive('SERVICE_ERROR')) {
    toastInstance({
      id: 'SERVICE_ERROR',
      title: '系统内部异常 - 请稍微再试',
      position: 'bottom',
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }

  return { ...response };
}, (err) => {
  const { code, message, response } = err;
  if (
    (code === 'ECONNABORTED' || message === 'Network Error')
    && !toastInstance.isActive('NETWORK_ERROR')
  ) {
    toastInstance({
      id: 'NETWORK_ERROR',
      title: '网络超时 - 刷新页面以恢复',
      position: 'bottom',
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  } else if (response && response.data) {
    const res = response.data;
    if (res.code === 10000003 || res.code === 10000006) {
      window.location.href = '/login';
    }
  }

  return Promise.reject(err);
});

export async function request<T = any>(
  options: AxiosRequestConfig,
): Promise<T> {
  try {
    const data = await fclient<T>(options);
    return (data.data) as T;
  } catch (err: any) {
    console.error(err);
    if (err?.response?.status === 401) {
      window.location.href = '/login';
    } else if (err?.response?.status === 403) {
      window.location.href = '/login';
    } else if (err?.response?.status === 404) {
      window.location.href = '/login';
    }
    if (err?.response) {
      throw err.response.data || '';
    }

    throw err;
  }
}

// eslint-disable-next-line consistent-return
export const login = async (username: string, password: string): Promise<{ code: number, token: AccessToken, data: User }> => {
  try {
    const { data } = await fclient<{ code: number, token: AccessToken, data: User }>({
      method: 'POST',
      url: '/api/login',
      headers: {
        username,
        password,
      },
    });
    return data;
  } catch (err: any) {
    toastInstance.closeAll();
    toastInstance({
      title: '登录报错',
      description: err?.response?.data || err?.message || '登录报错',
      position: 'bottom',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    throw err;
  }
};

export const logout = () => {
  localStorage.removeItem('user_token');
};
