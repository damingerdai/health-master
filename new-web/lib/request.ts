import axios, { AxiosRequestConfig } from "axios";

const client = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function request<T = any>(
  options: AxiosRequestConfig,
): Promise<T> {
  try {
    const data = await client<T>(options);

    return data.data as T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (typeof window !== "undefined") {
      // if (err?.response?.status === 401) {
      //   window.location.href = "/login";
      // } else if (err?.response?.status === 403) {
      //   window.location.href = "/login";
      // } else if (err?.response?.status === 404) {
      //   window.location.href = "/login";
      // }
    }
    if (err?.response) {
      throw err.response.data || "";
    }

    throw err;
  }
}
