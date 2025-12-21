import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { DataResponse, isErrorResponse, TokenResponse } from '@/types/response';
import { User } from '@/types/user';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export class HttpClient {
  constructor(private axiosInstance: AxiosInstance) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.axiosInstance<T>(config);

      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.data) {
        throw err.response.data;
      }
      throw err;
    }
  }

  public async login(
    username: string,
    password: string
  ): Promise<TokenResponse & DataResponse<User>> {
    try {
      const { data: tokenRes } = await this.axiosInstance<TokenResponse>({
        method: 'POST',
        url: '/api/v1/token',
        headers: {
          username,
          password
        }
      });
      if (isErrorResponse(tokenRes)) {
        throw tokenRes;
      }
      const { accessToken } = tokenRes.token;
      const { data: userRes } = await this.axiosInstance<DataResponse<User>>({
        method: 'GET',
        url: '/api/v1/user',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (isErrorResponse(userRes)) {
        throw userRes;
      }

      return {
        code: 200,
        token: {
          ...tokenRes.token
        },
        data: {
          ...userRes.data
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.data) {
        return err.response.data;
      }
      throw err;
    }
  }
}

export const httpClient = new HttpClient(client);
