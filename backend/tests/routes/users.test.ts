import supertest from 'supertest';
import app from '../../app/app';
import { describe } from '@jest/globals';
import * as db from '../db';
import { randomUUID } from 'crypto';
import User from '../../models/User';
import {
  adminDirectorDto,
  bearer,
  createDefaultUsers,
  newUserCreateDto,
  signTokensFor,
  userManagerDto,
} from '../test-helpers';
import { IUserWithActivity } from '../test-types';
import mongoose, { Types } from 'mongoose';
import Token from '../../models/Token';

const request = supertest(app);

const usersRoute = '/api/users';
const userRegistrationRoute = `${usersRoute}/register`;
const userLogInRoute = `${usersRoute}/login`;
const userLogOutRoute = `${usersRoute}/logout`;
const userTokenRefreshRoute = `${usersRoute}/refresh`;

describe(`usersRouter ${usersRoute}`, () => {
  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe(`GET ${usersRoute}`, () => {
    describe('unauthorized user tries to get users list', () => {
      test('it should return statusCode 401 and error message', async () => {
        const res = await request.get(usersRoute);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens tries to get users list', () => {
      test('it should return statusCode 401 and error message', async () => {
        const res = await request
          .get(usersRoute)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user with role "user" tries to get users list', () => {
      test('it should return statusCode 403 and error message', async () => {
        const user = await User.create(userManagerDto);
        const { accessToken, refreshToken } = await signTokensFor(user);
        const res = await request
          .get(usersRoute)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Forbidden');
      });
    });

    describe('authorized user with role "admin" tries to get users list', () => {
      test('it should return statusCode 200 and list of users', async () => {
        const [admin] = await createDefaultUsers();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .get(usersRoute)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const usersList = res.body as (IUserWithActivity & { password: string })[];
        const oneUser = usersList[0];

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(usersList)).toBe(true);
        expect(usersList.length).toBe(3);
        expect(mongoose.isValidObjectId(oneUser.id)).toBe(true);
        expect(oneUser.password).toBeUndefined();
        expect(oneUser.firstName).not.toBeUndefined();
        expect(oneUser.dayActivity).not.toBeUndefined();
        expect(oneUser.overallActivity).not.toBeUndefined();
        expect(oneUser.dayActivity.time).not.toBeUndefined();
        expect(oneUser.dayActivity.count).not.toBeUndefined();
        expect(oneUser.overallActivity.time).not.toBeUndefined();
        expect(oneUser.overallActivity.count).not.toBeUndefined();
      });
    });
  });

  describe(`POST ${userRegistrationRoute}`, () => {
    describe('unauthorized user tries to register a new user', () => {
      test('it should return statusCode 401 and error message', async () => {
        const res = await request.post(userRegistrationRoute);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('unauthorized user tries to register a new user', () => {
      test('it should return statusCode 401 and error message', async () => {
        const res = await request
          .post(userRegistrationRoute)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user with role "user" tries to register a new user', () => {
      test('it should return statusCode 403 and error message', async () => {
        const user = await User.create(userManagerDto);
        const { accessToken, refreshToken } = await signTokensFor(user);
        const res = await request
          .post(userRegistrationRoute)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Forbidden');
      });
    });

    describe('authorized user with role "admin" tries to register a new user', () => {
      test('provided correct data, it should return statusCode 201', async () => {
        const [admin] = await createDefaultUsers();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .post(userRegistrationRoute)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken))
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('lastName', newUserCreateDto.lastName)
          .field('firstName', newUserCreateDto.firstName)
          .field('email', newUserCreateDto.email)
          .field('password', newUserCreateDto.password)
          .field('employed', newUserCreateDto.employed)
          .field('role', newUserCreateDto.role)
          .field('birthDay', newUserCreateDto.birthDay)
          .field('phone', newUserCreateDto.phone)
          .field('position', newUserCreateDto.position);

        expect(res.statusCode).toBe(201);
      });

      test('provided incorrect data, it should return statusCode 422 and error ValidationError', async () => {
        const [admin] = await createDefaultUsers();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .post(userRegistrationRoute)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken))
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('firstName', newUserCreateDto.firstName)
          .field('lastName', newUserCreateDto.lastName)
          .field('email', newUserCreateDto.email)
          .field('password', newUserCreateDto.password)
          .field('position', newUserCreateDto.position);
        const name = res.body.name;

        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });

      test('provided duplicate email, it should return statusCode 422 and error ValidationError', async () => {
        await User.create(newUserCreateDto);
        const [admin] = await createDefaultUsers();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .post(userRegistrationRoute)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken))
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('firstName', newUserCreateDto.firstName)
          .field('lastName', newUserCreateDto.lastName)
          .field('email', newUserCreateDto.email)
          .field('password', newUserCreateDto.password)
          .field('employed', newUserCreateDto.employed)
          .field('role', newUserCreateDto.role)
          .field('birthDay', newUserCreateDto.birthDay)
          .field('phone', newUserCreateDto.phone)
          .field('position', newUserCreateDto.position);
        const validationError = res.body;

        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.email).not.toBeUndefined();
      });
    });
  });

  describe(`POST ${userLogInRoute}`, () => {
    describe('user tries to log in', () => {
      test('provided incorrect email, it should return statusCode 422 and error message', async () => {
        await createDefaultUsers();
        const randomMail = 'random@mail.com';
        const res = await request.post(userLogInRoute).send({ email: randomMail, password: adminDirectorDto.password });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Wrong email or password');
      });

      test('provided incorrect password, it should return statusCode 422 and error message', async () => {
        await createDefaultUsers();
        const randomPassword = 'random@password';
        const res = await request.post(userLogInRoute).send({
          email: adminDirectorDto.email,
          password: randomPassword,
        });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Wrong email or password');
      });

      test('provided correct data, it should return statusCode 200, message, accessToken and set cookie - refreshToken', async () => {
        await createDefaultUsers();
        const res = await request.post(userLogInRoute).send({
          email: adminDirectorDto.email,
          password: adminDirectorDto.password,
        });
        const loginResponse = res.body;
        const setCookieHeader: string[] = res.headers['set-cookie'];
        const cookies = setCookieHeader.map((cookie) => cookie.split(';')[0]);

        expect(res.statusCode).toBe(200);
        expect(cookies.length).toBe(1);
        expect(loginResponse.accessToken).not.toBeUndefined();
        expect(loginResponse.message).toBe('User logged in successfully!');
        expect(mongoose.isValidObjectId(loginResponse.user.id)).toBe(true);
        expect(loginResponse.user.dayActivity).toBeUndefined();
        expect(loginResponse.user.overallActivity).toBeUndefined();
        expect(loginResponse.user.firstName).toBe(adminDirectorDto.firstName);
        expect(loginResponse.user.email).toBe(adminDirectorDto.email);
        expect(loginResponse.user.password).toBeUndefined();
      });
    });
  });

  describe(`DELETE ${userLogOutRoute}`, () => {
    describe('authorized user tries to log out', () => {
      test('it should return statusCode 204 and remove refreshToken from DB and cookies', async () => {
        const [admin] = await createDefaultUsers();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .delete(userLogOutRoute)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const setCookieHeader: string[] = res.headers['set-cookie'];
        const cookies = setCookieHeader.map((cookie) => cookie.split(';')[0]);
        const refreshTokenCookie = cookies[0].split('=');
        const token = await Token.findOne({ user: admin._id });

        expect(res.statusCode).toBe(204);
        expect(token).toBeFalsy();
        expect(refreshTokenCookie[0]).toBe('refreshToken');
        expect(refreshTokenCookie[1]).toBe('');
      });
    });
  });

  describe(`GET ${userTokenRefreshRoute}`, () => {
    describe(`authorized user tries to refresh tokens`, () => {
      test('it should return statusCode 200, message, user and a new access token', async () => {
        const [admin] = await createDefaultUsers();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .get(userTokenRefreshRoute)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const refreshResponse = res.body;

        expect(res.statusCode).toBe(200);
        expect(refreshResponse.message).toBe('Token refreshed!');
        expect(refreshResponse.accessToken).not.toBeUndefined();
        expect(refreshResponse.user).not.toBeUndefined();
        expect(refreshResponse.user.password).toBeUndefined();
        expect(mongoose.isValidObjectId(refreshResponse.user.id)).toBe(true);
      });
    });
  });

  describe(`GET ${usersRoute}/:id`, () => {
    describe('unauthorized user tries to a user by id', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const userId = admin._id.toString();
        const res = await request.get(`${usersRoute}/${userId}`);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens tries to get a user by id', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const userId = admin._id.toString();
        const res = await request
          .get(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user tries to get one user by id', () => {
      test('it should return statusCode 200 and one user object', async () => {
        const [admin, user] = await createDefaultUsers();
        const userId = user._id.toString();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .get(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const oneUser = res.body as IUserWithActivity & { password: string };

        expect(res.statusCode).toBe(200);
        expect(mongoose.isValidObjectId(oneUser.id)).toBe(true);
        expect(oneUser.firstName).not.toBeUndefined();
        expect(oneUser.password).toBeUndefined();
        expect(oneUser.dayActivity).not.toBeUndefined();
        expect(oneUser.dayActivity.time).not.toBeUndefined();
        expect(oneUser.overallActivity).not.toBeUndefined();
        expect(oneUser.dayActivity.count).not.toBeUndefined();
        expect(oneUser.overallActivity.time).not.toBeUndefined();
        expect(oneUser.overallActivity.count).not.toBeUndefined();
      });
    });
  });

  describe(`PATCH ${usersRoute}/:id`, () => {
    describe('unauthorized user tries to edit one user by id', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const userId = admin._id.toString();
        const res = await request
          .patch(`${usersRoute}/${userId}`)
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('firstName', newUserCreateDto.firstName)
          .field('lastName', newUserCreateDto.lastName);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens tries to edit a user by id', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const userId = admin._id.toString();
        const newData = { firstName: 'New firstname', lastName: 'New lastName' };
        const res = await request
          .patch(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()))
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('firstName', newData.firstName)
          .field('lastName', newData.lastName);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user with role "user" tries to edit one user by id', () => {
      test('provided own id, it should return statusCode 204', async () => {
        const user = (await createDefaultUsers())[1];
        const userId = user._id.toString();
        const newData = { firstName: 'New firstname', lastName: 'New lastName' };
        const oldData = { avatar: user.avatar };
        const { accessToken, refreshToken } = await signTokensFor(user);
        const res = await request
          .patch(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken))
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('firstName', newData.firstName)
          .field('lastName', newData.lastName);
        const changedUser = await User.findById(userId);

        expect(res.statusCode).toBe(204);

        if (changedUser) {
          expect(changedUser.firstName).toBe(newData.firstName);
          expect(changedUser.lastName).toBe(newData.lastName);
          expect(changedUser.avatar).not.toBe(oldData.avatar);
        }
      });

      test('provided another user id, it should return statusCode 403', async () => {
        const [admin, user] = await createDefaultUsers();
        const userId = admin._id.toString();
        const newData = { firstName: 'New firstname', lastName: 'New lastName' };
        const oldData = { avatar: admin.avatar };
        const { accessToken, refreshToken } = await signTokensFor(user);
        const res = await request
          .patch(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken))
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('lastName', newData.lastName)
          .field('firstName', newData.firstName);
        const changedUser = await User.findById(userId);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Forbidden');

        if (changedUser) {
          expect(changedUser.firstName).not.toBe(newData.firstName);
          expect(changedUser.lastName).not.toBe(newData.lastName);
          expect(changedUser.avatar).toBe(oldData.avatar);
        }
      });
    });

    describe('authorized user with role "admin" tries to edit one user by id', () => {
      test('provided any user id, it should return statusCode 204', async () => {
        const [admin, user] = await createDefaultUsers();
        const userId = user._id.toString();
        const newData = { firstName: 'New firstname', lastName: 'New lastName' };
        const oldData = { avatar: user.avatar };
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .patch(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken))
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('firstName', newData.firstName)
          .field('lastName', newData.lastName);
        const changedUser = await User.findById(userId);

        expect(res.statusCode).toBe(204);

        if (changedUser) {
          expect(changedUser.firstName).toBe(newData.firstName);
          expect(changedUser.lastName).toBe(newData.lastName);
          expect(changedUser.avatar).not.toBe(oldData.avatar);
        }
      });

      test('provided invalid mongodb id, it should return statusCode 400 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const invalidId = randomUUID();
        const newData = { firstName: 'New firstname', lastName: 'New lastName' };
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .patch(`${usersRoute}/${invalidId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken))
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('firstName', newData.firstName)
          .field('lastName', newData.lastName);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(400);
        expect(errorMessage).toBe('Invalid user id');
      });

      test('provided non-existent id, it should return statusCode 404 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const randomMongoId = new Types.ObjectId().toString();
        const newData = { firstName: 'New firstname', lastName: 'New lastName' };
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .patch(`${usersRoute}/${randomMongoId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken))
          .field('firstName', newData.firstName)
          .attach('avatar', './tests/testFiles/avatar.jpg')
          .field('lastName', newData.lastName);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Cannot update non-existent user');
      });
    });
  });

  describe(`DELETE ${usersRoute}/:id`, () => {
    describe('unauthorized user tries to delete one user', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const userId = admin._id.toString();
        const res = await request.delete(`${usersRoute}/${userId}`);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens tries to delete one user', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const userId = admin._id.toString();
        const res = await request
          .delete(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user with role "user" tries to delete any other user', () => {
      test('it should return statusCode 403 and error message', async () => {
        const user = (await createDefaultUsers())[1];
        const userId = user._id.toString();
        const { accessToken, refreshToken } = await signTokensFor(user);
        const res = await request
          .delete(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Forbidden');
      });
    });

    describe('authorized user with role "admin" tries to delete any other user', () => {
      test('it should return statusCode 204', async () => {
        const [admin, user] = await createDefaultUsers();
        const userId = user._id.toString();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .delete(`${usersRoute}/${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));

        expect(res.statusCode).toBe(204);
      });

      test('provided invalid mongodb id, it should return statusCode 400 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const invalidMongoId = randomUUID();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .delete(`${usersRoute}/${invalidMongoId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(400);
        expect(errorMessage).toBe('Invalid user id');
      });

      test('provided non-existent user id, it should return statusCode 404 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const randomMongoId = new Types.ObjectId().toString();
        const { accessToken, refreshToken } = await signTokensFor(admin);
        const res = await request
          .delete(`${usersRoute}/${randomMongoId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Not Found');
      });
    });
  });
});
