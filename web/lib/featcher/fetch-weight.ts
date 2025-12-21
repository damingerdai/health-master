import { ListResponse } from '@/types/response';
import { request } from '../request';
import { WeightRecord } from '@/types/weight-record';

interface IFetchWeightRecordInput {
  userId?: string;
  pageNo?: number;
  pageSize?: number;
}

export const fetchWeightRecord = async (input: IFetchWeightRecordInput) => {
  const params = {
    page: (input.pageNo ?? 1).toString(),
    limit: (input.pageSize, 5).toString()
  };
  const searchParams = new URLSearchParams(params as Record<string, string>);
  const paramString = searchParams.toString();
  const res = await request<ListResponse<WeightRecord>>({
    method: 'GET',
    url: `/api/user-weight-records?${paramString}`
  });

  return res;
};
