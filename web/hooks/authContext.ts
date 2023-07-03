import { User } from '@/type/user';
import { createContext } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string;
  currentUser: User;
  loadingCurrentUser: boolean;
  setUserId: (userId: string) => void;
  signin: (token: string, callback?: VoidFunction) => void;
  signout: (callback?: VoidFunction) => void;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AuthContext = createContext<AuthContextType>(null!);
