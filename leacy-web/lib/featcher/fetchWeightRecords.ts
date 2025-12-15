import { request } from '../request';
import { ListResponse } from '../response';
import { IWeightRecord } from '../weight-record';

interface IFetchWeightRecordInput {
  userId?: string;
  pageNo?: number;
  pageSize?: number;
}

export const fetchWeightRecord = async (input: IFetchWeightRecordInput) => {
  const params = { userId: input.userId, page: (input.pageNo ?? 1).toString(), limit: (input.pageSize, 5).toString() };
  const searchParams = new URLSearchParams(params as Record<string, string>);
  const paramString = searchParams.toString();
  const res = await request<ListResponse<IWeightRecord>>({
    method: 'GET',
    url: `/api/weight-records?${paramString}`,
  });

  return res;
};
