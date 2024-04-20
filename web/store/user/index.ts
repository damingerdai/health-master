import { atom } from 'jotai';

interface UserState {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
}

export const initialUserState: UserState = {
  id: '',
  username: '',
  firstName: '',
  lastName: '',
  gender: '',
};

export const userAtom = atom(initialUserState);
