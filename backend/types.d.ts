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
  position: string;
  avatar: string;
  employed: Date;
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
  position: string;
  avatar: string;
  employed: string;
}

export interface IResponseUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  avatar: string | null;
  employed: Date;
}

export interface IToken {
  user: Types.ObjectId;
  refreshToken: string;
}

export interface IError {
  error: string;
}
