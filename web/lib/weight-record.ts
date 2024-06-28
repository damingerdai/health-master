import { IUser } from './user';

export interface IWeightRecord {
  id: string;
  userId: string;
  user: IUser;
  weight: number;
  recordDate: Date;
}
