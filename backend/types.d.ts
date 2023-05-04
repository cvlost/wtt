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
}

export interface IResponseUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IToken {
  user: Types.ObjectId;
  refreshToken: string;
}