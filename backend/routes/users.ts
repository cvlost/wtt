import express from 'express';
import { ICreateUserDto, IUserLoginDto } from '../types';
import { Error } from 'mongoose';
import User from '../models/User';
import { generateToken, saveToken } from '../services/jwtService';
import ResponseUserDto from '../dto/ResponseUserDto';

const usersRouter = express.Router();

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

export default usersRouter;
