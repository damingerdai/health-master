import { DataResponse, isErrorResponse, TokenResponse } from '@/type/response';
import { User } from '@/type/user';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.axiosInstance<T>(config);
      return data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return err.response.data;
      }
      throw err;
    }
  }

  public async login(username: string, password: string): Promise<TokenResponse & DataResponse<User>> {
    try {
      const { data: tokenRes } = await this.axiosInstance<TokenResponse>({
        method: 'POST',
        url: '/api/v1/token',
        headers: {
          username,
          password,
        },
      });
      if (isErrorResponse(tokenRes)) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw tokenRes;
      }
      const { accessToken } = tokenRes.token;
      const { data: userRes } = await this.axiosInstance<DataResponse<User>>({
        method: 'GET',
        url: '/api/v1/user',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (isErrorResponse(userRes)) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw userRes;
      }
      return {
        code: 0,
        token: {
          ...tokenRes.token,
        },
        data: {
          ...userRes.data,
        },
      };
    } catch (err: any) {
      if (err.response && err.response.data) {
        return err.response.data;
      }
      throw err;
    }
  }
}

export const httpClient = new HttpClient(client);
