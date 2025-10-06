import { User } from "./user";

export interface UserTemperature {
  id: string;
  userId: string;
  temperature: number;  
  recordDate: Date;  
  note?: string;
  unit: "C" | "F"; // Celsius or Fahrenheit
  user?: User;
  createdAt: Date; // ISO date string
  updatedAt: Date; // ISO date string
}

export type UserTemperatures = UserTemperature[];

export interface CreateUserTemperatureRequest {
  temperature: number; // in Celsius
  recordedAt: string; // ISO date string
  note?: string;
}

export interface UpdateUserTemperatureRequest {
  temperature?: number; // in Celsius
  recordedAt?: string; // ISO date string
  note?: string;
}

