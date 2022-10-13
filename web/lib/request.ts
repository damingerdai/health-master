import axios, { AxiosRequestConfig } from "axios";

const fclient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function request<T = any>(
  options: AxiosRequestConfig
): Promise<T> {
  try {
    const data = await fclient<T>(options);

    return data as T;
  } catch (err) {
    console.error(err);

    throw err;
  }
}

const bclient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  export async function http<T = any>(
    options: AxiosRequestConfig
  ): Promise<T> {
    try {
      const data = await bclient<T>(options);
  
      return data as T;
    } catch (err) {
      console.error(err);
  
      throw err;
    }
  }
