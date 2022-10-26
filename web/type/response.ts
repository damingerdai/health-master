import { AccessToken } from "./token";

export type ErrorResponse = { error: string };

export type TokenResponse = { token: AccessToken } | ErrorResponse

export type DataResponse<T = any> = { data: T } | ErrorResponse

export function isErrorResponse(response: any): response is ErrorResponse {
    return 'error' in response;
}