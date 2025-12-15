export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type Users = Array<User>;
