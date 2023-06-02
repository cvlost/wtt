import { RequestHandler } from 'express';
import * as usersService from '../services/users-service';
import { ICreateUserDto, IUserLoginDto } from '../types';
import ResponseUserDto from '../dto/ResponseUserDto';
import {
  checkTokenExistence,
  generateToken,
  removeToken,
  saveToken,
  validateRefreshToken,
} from '../services/jwt-service';
import { Error } from 'mongoose';
import { ServerError } from '../errors/errors';

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const users = await usersService.getAll();
    return res.send(users);
  } catch (e) {
    return next(e);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  const id = req.params.id as string;

  try {
    const user = await usersService.getOne(id);
    return res.send(user);
  } catch (e) {
    return next(e);
  }
};

export const register: RequestHandler = async (req, res, next) => {
  const avatar = req.file ? req.file.filename : null;
  const { firstName, lastName, password, email, employed, phone, position, role } = req.body as ICreateUserDto;
  const dto: ICreateUserDto = { firstName, lastName, password, email, employed, phone, position, avatar, role };

  try {
    const user = await usersService.create(dto);
    const userResponseDto = new ResponseUserDto(user);
    const tokens = generateToken({ ...userResponseDto });
    await saveToken(user._id, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 1000 * 60 * 60, httpOnly: true });

    return res.status(201).send({
      user: userResponseDto,
      accessToken: tokens.accessToken,
      message: 'Registration was successful!',
    });
  } catch (e) {
    if (e instanceof ServerError) return res.status(e.statusCode).send(e);
    if (e instanceof Error.ValidationError) return res.status(400).send(e);
    return next(e);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body as IUserLoginDto;

  try {
    const user = await usersService.login(email, password);
    const userResponseDto = new ResponseUserDto(user);
    const tokens = generateToken({ ...userResponseDto });
    await saveToken(user._id, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 1000 * 60 * 60, httpOnly: true });

    return res.status(200).send({
      message: 'User logged in successfully!',
      user: userResponseDto,
      accessToken: tokens.accessToken,
    });
  } catch (e) {
    if (e instanceof ServerError) return res.status(e.statusCode).send(e);
    return next(e);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  const message = { message: 'Logged out successfully!' };

  try {
    const { refreshToken } = req.cookies;
    await removeToken(refreshToken);
    res.clearCookie('refreshToken');

    return res.send(message);
  } catch (e) {
    return next(e);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).send('Unauthorized: Refresh token was not present');

    const userPayload = validateRefreshToken(refreshToken);
    await checkTokenExistence(refreshToken);

    const user = await usersService.findById(userPayload.id);
    if (!user) return res.status(401).send({ error: 'Cannot refresh tokens - user does not exist' });

    const userResponseDto = new ResponseUserDto(user);
    const tokens = generateToken({ ...userResponseDto });

    await saveToken(user._id, tokens.refreshToken);

    return res.status(200).send({
      message: 'Token refreshed!',
      user: userResponseDto,
      accessToken: tokens.accessToken,
    });
  } catch (e) {
    if (e instanceof ServerError) return res.status(e.statusCode).send(e);
    return next(e);
  }
};
