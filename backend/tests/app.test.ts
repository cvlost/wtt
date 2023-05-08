import supertest from 'supertest';
import app from '../app/app';
import { describe } from '@jest/globals';

const request = supertest(app);

describe('API healthcheck', () => {
  test('GET - /', async () => {
    const res = await request.get('/').send();
    const body = res.body;
    const message = body.message;
    expect(res.statusCode).toBe(200);
    expect(message).toBe('Hello World!');
  });
});
