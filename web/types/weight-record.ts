import { User } from './user';

export interface WeightRecord {
  id: string;
  userId: string;
  user: User;
  weight: number;
  recordDate: Date;
}

export type WeightRecords = WeightRecord[];
