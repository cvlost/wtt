import { RequestHandler } from 'express';
import { IRequestWithUserPayload } from '../types';
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

export const getByDate: RequestHandler = async (req, res, next) => {
  const user = (req as IRequestWithUserPayload).user;
  const date = req.params.date as string;

  try {
    const reports = await reportsService.getByDate(user.id, date);
    return res.send(reports);
  } catch (e) {
    return next(e);
  }
};
//
// export const createOne: RequestHandler = async (req, res, next) => {
//   try {
//     const task = await tasksService.createOne(dto);
//     return res.send(task);
//   } catch (e) {
//     return next(e);
//   }
// };
//
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
