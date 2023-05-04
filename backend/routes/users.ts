import express from 'express';
import { ICreateUserDto, IUserLoginDto } from '../types';
import { Error } from 'mongoose';
import User from '../models/User';
import { findToken, generateToken, removeToken, saveToken, validateRefreshToken } from '../services/jwtService';
import ResponseUserDto from '../dto/ResponseUserDto';
import auth from '../middleware/auth';

const usersRouter = express.Router();

usersRouter.get('/', auth, async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    return next(e);
  }
});

usersRouter.post('/registration', async (req, res, next) => {
  const { firstName, lastName, password, email } = req.body as ICreateUserDto;
  const dto: ICreateUserDto = { firstName, lastName, password, email };

  try {
    const candidate = await User.findOne({ email });
    if (candidate) res.status(400).send({ error: 'Email is already taken' });

    const user = await User.create(dto);
    const userResponseDto = new ResponseUserDto(user);
    const tokens = generateToken({ ...userResponseDto });

    await saveToken(user._id, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 1000 * 40, httpOnly: true });

    return res.status(201).send({
      user: userResponseDto,
      accessToken: tokens.accessToken,
      message: 'Registration was successful!',
    });
  } catch (e) {
    if (e instanceof Error.ValidationError) return res.status(400).send(e);
    return next(e);
  }
});

usersRouter.post('/login', async (req, res, next) => {
  const { email, password } = req.body as IUserLoginDto;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: 'Wrong email' });

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) return res.status(400).send({ error: 'Wrong password' });

    const userResponseDto = new ResponseUserDto(user);
    const tokens = generateToken({ ...userResponseDto });

    await saveToken(user._id, tokens.refreshToken);

    res.status(200).send({
      message: 'User logged in successfully!',
      user: userResponseDto,
      accessToken: tokens.accessToken,
    });
  } catch (e) {
    return next(e);
  }
});

usersRouter.delete('/logout', async (req, res, next) => {
  const message = { message: 'Logged out successfully!' };

  try {
    const { refreshToken } = req.cookies;
    await removeToken(refreshToken);
    res.clearCookie('refreshToken');
    return res.send(message);
  } catch (e) {
    return next(e);
  }
});

usersRouter.get('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.status(401).send('Unauthorized');

    const userPayload = validateRefreshToken(refreshToken);
    const tokenFromDb = await findToken(refreshToken);

    if (!userPayload || !tokenFromDb) return res.status(401).send('Unauthorized');

    const user = await User.findById(userPayload.id);

    if (!user) return res.status(404).send({ error: 'Cannot refresh tokens - user does not exist anymore!' });

    const userResponseDto = new ResponseUserDto(user);
    const tokens = generateToken({ ...userResponseDto });

    await saveToken(user._id, tokens.refreshToken);

    res.status(200).send({
      message: 'Token refreshed!',
      user: userResponseDto,
      accessToken: tokens.accessToken,
    });
  } catch (e) {
    return next(e);
  }
});

export default usersRouter;
