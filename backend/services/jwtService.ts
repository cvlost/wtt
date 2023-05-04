import jwt from 'jsonwebtoken';
import config from '../config';
import Token from '../models/Token';
import { Types } from 'mongoose';

export const generateToken = (payload: object) => {
  const accessToken = jwt.sign(payload, config.jwtAccessSecret, { expiresIn: '20s' });
  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '40s' });

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
