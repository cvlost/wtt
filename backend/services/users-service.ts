import User from '../models/User';
import { ICreateUserDto } from '../types';
import { BadRequest } from '../errors/errors';
import { Types } from 'mongoose';

export const getAll = async () => {
  return User.find();
};

export const getOne = async (_id: string) => {
  return User.findById({ _id });
};

export const findById = async (id: string | Types.ObjectId) => {
  return User.findById(id);
};

export const create = async (dto: ICreateUserDto) => {
  const { email } = dto;
  const candidate = await User.findOne({ email });

  if (candidate) throw new BadRequest('Email is already taken');

  return await User.create(dto);
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new BadRequest('Wrong email');

  const isPasswordValid = await user.checkPassword(password);
  if (!isPasswordValid) throw new BadRequest('Wrong password');

  return user;
};
