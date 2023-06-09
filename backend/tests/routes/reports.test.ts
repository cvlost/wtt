import supertest from 'supertest';
import app from '../../app/app';
import { describe } from '@jest/globals';
import * as db from '../db';
import { randomUUID } from 'crypto';
import { bearer, createDefaultUsers, createReportsFor, newReportDtoFor } from '../test-helpers';
import { generateToken, saveToken } from '../../services/jwt-service';
import ResponseUserDto from '../../dto/ResponseUserDto';
import { IDayReport, IDaySummary, IReport } from '../test-types';
import Report from '../../models/Report';

const request = supertest(app);

const reportsRoute = '/api/reports';
const singleReportRoute = `${reportsRoute}/single`;

describe(`reportsRouter ${reportsRoute}`, () => {
  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe(`GET ${reportsRoute}`, () => {
    describe('unauthorized user tries to get all days summary', () => {
      test('it should return statusCode 401 and error message', async () => {
        const res = await request.get(reportsRoute);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens tries to get all days summary', () => {
      test('it should return statusCode 401 and error message', async () => {
        const res = await request
          .get(reportsRoute)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user with role "user" tries to get all days summary', () => {
      test("query param is user's own id, it should return statusCode 200 and all days summary", async () => {
        const [admin, user] = await createDefaultUsers();
        const userId = user._id.toString();
        await createReportsFor(admin, 1, '2000-10-10');
        await createReportsFor(user, 1, '2020-01-01');
        await createReportsFor(user, 1, '2020-01-02');
        await createReportsFor(user, 1, '2020-01-03');
        await createReportsFor(user, 1, '2020-01-04');
        const userDto = new ResponseUserDto(user);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(user._id, refreshToken);
        const res = await request
          .get(`${reportsRoute}?user=${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const reportList = res.body as IDaySummary[];
        const oneReport = reportList[0];

        expect(res.statusCode).toBe(200);
        expect(reportList.length).toBe(4);
        expect(oneReport.count).not.toBeUndefined();
        expect(oneReport.dateStr).not.toBeUndefined();
        expect(oneReport.totalTime).not.toBeUndefined();
      });

      test('query param is any other user id, it should return statusCode 403 and error message', async () => {
        const [admin, user] = await createDefaultUsers();
        const adminId = admin._id.toString();
        await createReportsFor(admin, 1, '2000-10-10');
        await createReportsFor(user, 1, '2020-01-01');
        const userDto = new ResponseUserDto(user);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(user._id, refreshToken);
        const res = await request
          .get(`${reportsRoute}?user=${adminId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Forbidden');
      });
    });

    describe('authorized user with role "admin" tries to get all days summary', () => {
      test('query param is any other user id, it should return statusCode 200 and all days summary', async () => {
        const [admin, user] = await createDefaultUsers();
        const userId = user._id.toString();
        await createReportsFor(admin, 1, '2000-10-10');
        await createReportsFor(user, 1, '2020-01-01');
        await createReportsFor(user, 1, '2020-01-02');
        await createReportsFor(user, 1, '2020-01-03');
        const userDto = new ResponseUserDto(admin);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(admin._id, refreshToken);
        const res = await request
          .get(`${reportsRoute}?user=${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const reportList = res.body as IDaySummary[];
        const oneReport = reportList[0];

        expect(res.statusCode).toBe(200);
        expect(reportList.length).toBe(3);
        expect(oneReport.count).not.toBeUndefined();
        expect(oneReport.dateStr).not.toBeUndefined();
        expect(oneReport.totalTime).not.toBeUndefined();
      });
    });
  });

  describe(`GET ${reportsRoute}/:date`, () => {
    describe('unauthorized user tries to get one day summary', () => {
      test('it should return statusCode 401 and error message', async () => {
        const date = '2000-01-01';
        const res = await request.get(`${reportsRoute}/${date}`);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens tries to get one day summary', () => {
      test('it should return statusCode 401 and error message', async () => {
        const date = '2000-01-01';
        const res = await request
          .get(`${reportsRoute}/${date}`)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user with role "user" tries to get one day summary', () => {
      test("query param is user's own id, it should return statusCode 200 and one day summary", async () => {
        const date = '2000-01-01';
        const [admin, user] = await createDefaultUsers();
        const userId = user._id.toString();
        await createReportsFor(admin, 5, date);
        await createReportsFor(user, 7, date);
        const userDto = new ResponseUserDto(user);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(user._id, refreshToken);
        const res = await request
          .get(`${reportsRoute}/${date}?user=${userId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const dayReport = res.body as IDayReport;

        expect(res.statusCode).toBe(200);
        expect(dayReport.user.id).toBe(userId);
        expect(dayReport.user.password).toBeUndefined();
        expect(dayReport.reports.length).toBe(7);
        expect(dayReport.dateStr).toBe(date);
        expect(dayReport.totalTime).not.toBeUndefined();
      });
    });
  });

  describe(`GET ${singleReportRoute}/:id`, () => {
    describe('unauthorized user tries to get one report', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin, user] = await createDefaultUsers();
        await createReportsFor(admin, 1);
        const [report] = await createReportsFor(user, 1);
        const reportId = report._id;
        const res = await request.get(`${singleReportRoute}/${reportId}`);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens tries to get one report', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin, user] = await createDefaultUsers();
        await createReportsFor(admin, 1);
        const [report] = await createReportsFor(user, 1);
        const reportId = report._id;
        const res = await request
          .get(`${singleReportRoute}/${reportId}`)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user tries to get one report', () => {
      test('it should return statusCode 200 and one report object', async () => {
        const [admin] = await createDefaultUsers();
        const [report] = await createReportsFor(admin, 1);
        const reportId = report._id.toString();
        const userDto = new ResponseUserDto(admin);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(admin._id, refreshToken);
        const res = await request
          .get(`${singleReportRoute}/${reportId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const oneReport = res.body as IReport;

        expect(res.statusCode).toBe(200);
        expect(oneReport.id).toBe(reportId);
        expect(oneReport.timeSpent).not.toBeUndefined();
      });
    });
  });

  describe(`POST ${reportsRoute}`, () => {
    describe('unauthorized user tries to create a new report', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const dto = newReportDtoFor(admin);
        const res = await request.post(reportsRoute).send(dto);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens trying to create a new report', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const dto = newReportDtoFor(admin);
        const res = await request
          .post(reportsRoute)
          .send(dto)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user tries to create a new report', () => {
      test('provided own id, it should return statusCode 201', async () => {
        const [admin] = await createDefaultUsers();
        const dto = newReportDtoFor(admin);
        const userDto = new ResponseUserDto(admin);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(admin._id, refreshToken);
        const res = await request
          .post(reportsRoute)
          .send(dto)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));

        expect(res.statusCode).toBe(201);
      });

      test('provided any other user id, it should return statusCode 403 and error message', async () => {
        const [admin, user] = await createDefaultUsers();
        const dto = newReportDtoFor(user);
        const userDto = new ResponseUserDto(admin);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(admin._id, refreshToken);
        const res = await request
          .post(reportsRoute)
          .send(dto)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Forbidden');
      });
    });
  });

  describe(`PATCH ${reportsRoute}/:id`, () => {
    describe('unauthorized user tries to edit one report', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const [report] = await createReportsFor(admin, 1);
        const adminId = admin._id.toString();
        const reportId = report._id.toString();
        const newData = { user: adminId, title: 'Some updated title' };
        const res = await request.patch(`${reportsRoute}/${reportId}`).send(newData);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens trying to edit one report', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const [report] = await createReportsFor(admin, 1);
        const adminId = admin._id.toString();
        const reportId = report._id.toString();
        const newData = { user: adminId, title: 'Some updated title' };
        const res = await request
          .patch(`${reportsRoute}/${reportId}`)
          .send(newData)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user tries to edit one report', () => {
      test('provided any other user id, it should return statusCode 403 and error message', async () => {
        const [admin, user] = await createDefaultUsers();
        const [report] = await createReportsFor(user, 1);
        const userId = user._id.toString();
        const userReportId = report._id.toString();
        const newData = { user: userId, title: 'Some updated title' };
        const userDto = new ResponseUserDto(admin);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(admin._id, refreshToken);
        const res = await request
          .patch(`${reportsRoute}/${userReportId}`)
          .send(newData)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const notChangedReport = await Report.findById(userReportId);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Forbidden');

        if (notChangedReport) {
          expect(notChangedReport.title).not.toBe(newData.title);
        }
      });
    });
  });

  describe(`DELETE ${reportsRoute}/:id`, () => {
    describe('unauthorized user tries to delete one report', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const [report] = await createReportsFor(admin, 1);
        const reportId = report._id.toString();
        const res = await request.delete(`${reportsRoute}/${reportId}`);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Unauthorized');
      });
    });

    describe('user provides random tokens trying to delete one report', () => {
      test('it should return statusCode 401 and error message', async () => {
        const [admin] = await createDefaultUsers();
        const [report] = await createReportsFor(admin, 1);
        const reportId = report._id.toString();
        const res = await request
          .delete(`${reportsRoute}/${reportId}`)
          .set('Cookie', [`refreshToken=${randomUUID()}`])
          .set('Authorization', bearer(randomUUID()));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Access token validation failed');
      });
    });

    describe('authorized user tries to delete one report', () => {
      test('provided own id, it should return statusCode 204', async () => {
        const [admin] = await createDefaultUsers();
        const [report] = await createReportsFor(admin, 1);
        const reportId = report._id.toString();
        const userDto = new ResponseUserDto(admin);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(admin._id, refreshToken);
        const res = await request
          .delete(`${reportsRoute}/${reportId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));

        expect(res.statusCode).toBe(204);
      });

      test('provided any other user id, it should return statusCode 403 and error message', async () => {
        const [admin, user] = await createDefaultUsers();
        const [report] = await createReportsFor(user, 1);
        const userReportId = report._id.toString();
        const userDto = new ResponseUserDto(admin);
        const { accessToken, refreshToken } = generateToken({ ...userDto });
        await saveToken(admin._id, refreshToken);
        const res = await request
          .delete(`${reportsRoute}/${userReportId}`)
          .set('Cookie', [`refreshToken=${refreshToken}`])
          .set('Authorization', bearer(accessToken));
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Forbidden');
      });
    });
  });
});
