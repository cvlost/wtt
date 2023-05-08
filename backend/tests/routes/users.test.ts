import supertest from 'supertest';
import app from '../../app/app';
import { describe } from '@jest/globals';
import * as db from '../db';
import { ICreateUserDto } from '../../types';
import usersRouter from '../../routes/users';

app.use('/api/users', usersRouter);

const request = supertest(app);

const userCreateDto: ICreateUserDto = {
  email: 'test@test.com',
  password: 'testPass',
  firstName: 'Bob',
  lastName: 'Marley',
};

describe('Route /users', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  let accessToken: string;
  let refreshTokenCookie: string;

  test('POST - /api/users/registration', async () => {
    const res = await request.post('/api/users/registration').send(userCreateDto);
    const registrationResponse = res.body;
    const setCookieHeader: string[] = res.headers['set-cookie'];
    const cookies = setCookieHeader.map((cookie) => cookie.split(';')[0]);
    expect(cookies.length).toBe(1);
    expect(res.statusCode).toBe(201);
    expect(registrationResponse.message).toBe('Registration was successful!');
    expect(registrationResponse.accessToken).not.toBeUndefined();
    refreshTokenCookie = cookies[0];
    accessToken = `Bearer ${registrationResponse.accessToken}`;
  });

  test('GET - /api/users', async () => {
    const res = await request
      .get('/api/users')
      .send()
      .set('Cookie', [refreshTokenCookie])
      .set('Authorization', accessToken);
    const usersList = res.body;
    expect(res.statusCode).toBe(200);
    expect(usersList.length).toBe(1);
  });
});
