import { LocationChangeEvent } from "@angular/common";

export interface IUser{
  id?: number;
  userName: string;
  password?: string | any;
  fitnessGoal: string;
  fitnessLevel: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
}

export interface IUserForLogin{
  userName: string;
  password: string;
}

