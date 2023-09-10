import { RequestStatus } from '@/type/request-status';
import { UserBloodPressures } from '@/type/user-blood-pressure';
import { atom } from 'jotai';

interface UserBloodPressureState {
  userBloodPressuresStatus: RequestStatus,
  userBloodPressures: UserBloodPressures,
  count: number
}

const initialState: UserBloodPressureState = {
  userBloodPressuresStatus: RequestStatus.IDLE,
  userBloodPressures: [],
  count: 0,
};

export const userBloodPressureStateAtom = atom(initialState);
