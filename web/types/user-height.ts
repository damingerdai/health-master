import { User } from "./user";

export interface UserHeight {
    id: string;
    userId: string;
    user: User;
    height: number;
    recordDate: Date;
}

export type UserHeights = UserHeight[];