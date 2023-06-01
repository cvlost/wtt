import jwt from 'jsonwebtoken';
import config from '../config';
import Token from '../models/Token';
import { Types } from 'mongoose';
import { IResponseUserDto } from '../types';
import { Unauthorized } from '../errors/errors';

export const generateToken = (payload: object) => {
  const accessToken = jwt.sign(payload, config.jwtAccessSecret, { expiresIn: '10s' });
  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '1h' });

  return { accessToken, refreshToken };
};

export const saveToken = async (userId: Types.ObjectId, refreshToken: string) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  return await Token.create({ user: userId, refreshToken });
};

export const removeToken = async (refreshToken: string) => {
  return Token.deleteOne({ refreshToken });
};

export const checkTokenExistence = async (refreshToken: string) => {
  const token = Token.findOne({ refreshToken });
  if (!token) throw new Unauthorized('Refresh token does not exist in the database');
  return token;
};

export const validateAccessToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtAccessSecret) as IResponseUserDto;
  } catch (e) {
    throw new Unauthorized('Access token validation failed');
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as IResponseUserDto;
  } catch (e) {
    throw new Unauthorized('Refresh token validation failed');
  }
};
