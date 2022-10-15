import axios, { AxiosRequestConfig } from "axios";
import { toastInstance } from "../components/toast";

const fclient = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

fclient.interceptors.request.use((config) => {
  const tokenString = localStorage.getItem('user_token');
  if (tokenString) {
    config!.headers!.Authorization = `Bearer ${tokenString}`;
  }

  return config;
})


export async function request<T = any>(
  options: AxiosRequestConfig
): Promise<T> {
  try {
    const data = await fclient<T>(options);

    return data as T;
  } catch (err: any) {
    if (err?.response?.status == 401) {
      window.location.href = "/login";
    } else if (err?.response?.status == 403) {
      window.location.href = "/login";
    } else if (err?.response?.status == 404) {
      window.location.href = "/login";
    }
    if (err?.response) {
      console.error({
        status: err.response.status,
        data: err.response.data,
        header: err.response.headers,
      });

      throw err.response.data || '';
    }

    throw err;
  }
}

export const login = async (username: string, password: string) => {
  try {
    const { data } = await fclient({
      method: 'POST',
      url: '/api/token',
      headers: {
        username,
        password
      }
    });
    localStorage.setItem('user_token', data.token.accessToken);
    if (data.error || !data.token?.accessToken) {
      toastInstance({
        title: '登录报错',
        description: data.error?.message || '登录报错',
        position: 'bottom',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    return data;
  } catch(err: any) {
    console.error(err);
    toastInstance({
      title: '登录报错',
      description: err?.message || '登录报错',
      position: 'bottom',
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }

}

const bclient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function http<T = any>(options: AxiosRequestConfig): Promise<T> {
  try {
    const data = await bclient<T>(options);

    return data as T;
  } catch (err) {
    console.error(err);

    throw err;
  }
}
