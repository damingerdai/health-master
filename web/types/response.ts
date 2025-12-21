import { AccessToken } from './token';

export type ErrorResponse = { code: number; message: string };

export type TokenResponse = { token: AccessToken } | ErrorResponse;

export type DataResponse<T = unknown> = { data: T } | ErrorResponse;

export type ListResponse<T> =
  | {
      count: number;
      data: Array<T>;
    }
  | ErrorResponse;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isErrorResponse(response: any): response is ErrorResponse {
  return 'code' in response && response.code !== 200;
}
