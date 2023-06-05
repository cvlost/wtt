import { Types } from 'mongoose';
import { Request } from 'express';

export interface IRequestWithUserPayload extends Request {
  user: IResponseUserDto;
}

export interface IUser {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  position: 'director' | 'manager' | 'employee';
  avatar: string | null;
  employed: Date;
  birthDay: Date;
  role: 'admin' | 'user';
}

export interface IUserLoginDto {
  password: string;
  email: string;
}

export interface ICreateUserDto {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  position: 'director' | 'manager' | 'employee';
  avatar: string | null;
  employed: string;
  birthDay: string;
  role: 'admin' | 'user';
}

export interface IUpdateUserDto {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  phone?: string;
  position?: 'director' | 'manager' | 'employee';
  avatar?: string;
  employed?: string;
  birthDay?: string;
  role?: 'admin' | 'user';
}

export interface IResponseUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: 'director' | 'manager' | 'employee';
  avatar: string | null;
  employed: Date;
  birthDay: Date;
  role: 'admin' | 'user';
}

export interface IToken {
  user: Types.ObjectId;
  refreshToken: string;
}

export interface IError {
  error: string;
}

export interface IReport {
  user: Types.ObjectId;
  dateStr: string;
  startedAt: Date;
  startedAtMinutes: number;
  finishedAt: Date;
  finishedAtMinutes: number;
  timeSpent: number;
  title: string;
  description: string;
}

export interface ICreateReportDto {
  user: string;
  dateStr: string;
  startedAt: string;
  finishedAt: string;
  title: string;
  description: string;
}
