import { User } from './user';

export interface UserBloodPressure {
  id: string;
  userId: string;
  diastolicBloodPressure: number;
  systolicBloodPressure: number;
  pulse: number;
  user?: User;
  createdAt?: Date;
  logDatetime?: Date;
}

export type UserBloodPressures = UserBloodPressure[];
