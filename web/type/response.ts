import { AccessToken } from './token';

export type ErrorResponse = { code: number, message };

export type TokenResponse = { token: AccessToken } | ErrorResponse;

export type DataResponse<T = any> = { data: T } | ErrorResponse;

export function isErrorResponse(response: any): response is ErrorResponse {
  return 'code' in response && response.code !== 0;
}
