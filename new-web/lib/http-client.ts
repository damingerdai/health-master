import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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
}

export const httpClient = new HttpClient(client);
