import { RequestHandler } from 'express';
import { ICreateReportDto, IRequestWithUserPayload } from '../types';
import * as reportsService from '../services/reports-service';

export const getAll: RequestHandler = async (req, res, next) => {
  const user = (req as IRequestWithUserPayload).user;
  const id = req.query.user as string | undefined;

  try {
    const reports = await reportsService.getAll(id || user.id);
    return res.send(reports);
  } catch (e) {
    return next(e);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  const id = req.params.id as string;

  try {
    const report = await reportsService.getOne(id);
    return res.send(report);
  } catch (e) {
    return next(e);
  }
};

export const createOne: RequestHandler = async (req, res, next) => {
  const { user, title, description, startedAt, finishedAt, dateStr } = req.body as ICreateReportDto;
  const dto: ICreateReportDto = { user, title, description, startedAt, finishedAt, dateStr };

  try {
    const task = await reportsService.createOne(dto);
    return res.send(task);
  } catch (e) {
    return next(e);
  }
};

export const getByDate: RequestHandler = async (req, res, next) => {
  const user = (req as IRequestWithUserPayload).user;
  const date = req.params.date as string;
  const id = req.query.user as string | undefined;

  try {
    const reports = await reportsService.getByDate(id || user.id, date);
    return res.send(reports);
  } catch (e) {
    return next(e);
  }
};

// export const updateOne: RequestHandler = async (req, res, next) => {
//   try {
//     const task = await tasksService.updateOne();
//     return res.send(task);
//   } catch (e) {
//     return next(e);
//   }
// };
//
// export const deleteOne: RequestHandler = async (req, res, next) => {
//   try {
//     const task = await tasksService.createOne(dto);
//     return res.send(task);
//   } catch (e) {
//     return next(e);
//   }
// };
