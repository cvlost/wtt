import { RequestHandler } from 'express';
import * as usersService from '../services/users-service';
import * as reportsService from '../services/reports-service';
import { ICreateUserDto, IEditor, IRequestWithUserPayload, IUpdateUserDto, IUserLoginDto } from '../types';
import { promises as fs } from 'fs';
import ResponseUserDto from '../dto/ResponseUserDto';
import {
  checkTokenExistence,
  generateToken,
  removeToken,
  saveToken,
  validateRefreshToken,
} from '../services/jwt-service';
import mongoose, { Error } from 'mongoose';
import { Forbidden, ServerError } from '../errors/errors';

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
  const body = req.body as ICreateUserDto;
  const dto: ICreateUserDto = {
    firstName: body.firstName,
    lastName: body.lastName,
    password: body.password,
    email: body.email,
    employed: body.employed,
    phone: body.phone,
    position: body.position,
    role: body.role,
    birthDay: body.birthDay,
    avatar,
  };

  try {
    await usersService.create(dto);

    return res.sendStatus(201);
  } catch (e) {
    if (req.file) await fs.unlink(req.file.path);
    if (e instanceof ServerError) return res.status(e.statusCode).send(e);
    if (e instanceof Error.ValidationError) return res.status(422).send(e);
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
  try {
    const { refreshToken } = req.cookies;

    await removeToken(refreshToken);
    res.clearCookie('refreshToken');

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

export const updateOne: RequestHandler = async (req, res, next) => {
  const user = (req as IRequestWithUserPayload).user;
  const userId = req.params.id as string;
  const editor: IEditor = { id: user.id, role: user.role };

  const avatar = req.file ? req.file.filename : undefined;
  const body = req.body as IUpdateUserDto;
  const dto: IUpdateUserDto = {
    firstName: body.firstName,
    lastName: body.lastName,
    password: body.password,
    email: body.email,
    employed: body.employed,
    phone: body.phone,
    position: body.position,
    role: body.role,
    birthDay: body.birthDay,
    avatar,
  };

  try {
    await usersService.updateOne(editor, userId, dto);

    return res.sendStatus(204);
  } catch (e) {
    if (req.file) await fs.unlink(req.file.path);
    if (e instanceof ServerError) return res.status(e.statusCode).send(e);
    if (e instanceof Error.ValidationError) return res.status(422).send(e);
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

export const deleteOne: RequestHandler = async (req, res, next) => {
  const id = req.params.id as string;
  const user = (req as IRequestWithUserPayload).user;

  if (!mongoose.isValidObjectId(id)) return res.status(400).send({ error: 'Invalid user id' });
  if (user.id === id) throw new Forbidden('Users cannot delete their own accounts');

  try {
    await reportsService.deleteMany(id);
    await usersService.deleteOne(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};
