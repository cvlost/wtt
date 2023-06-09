import { RequestHandler } from 'express';
import { ICreateReportDto, IRequestWithUserPayload } from '../types';
import * as reportsService from '../services/reports-service';
import mongoose from 'mongoose';
import Report from '../models/Report';

export const getAll: RequestHandler = async (req, res, next) => {
  const user = (req as IRequestWithUserPayload).user;
  const id = req.query.user as string | undefined;

  if (id && !mongoose.isValidObjectId(id)) return res.status(400).send('Invalid user id');
  if (user.role !== 'admin' && id && id !== user.id) return res.status(403).send({ error: 'Forbidden' });

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
  const reqUser = (req as IRequestWithUserPayload).user;
  const { user, title, description, startedAt, finishedAt, dateStr } = req.body as ICreateReportDto;
  const dto: ICreateReportDto = { user, title, description, startedAt, finishedAt, dateStr };

  if (reqUser.id !== user) return res.status(403).send({ error: 'Forbidden' });

  try {
    const isAllowed = reportsService.isAllowedDate(dateStr);

    if (!isAllowed) return res.status(403).send({ error: `Forbidden. Report is not allowed to edit` });

    await reportsService.createOne(dto);
    return res.sendStatus(201);
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

export const updateOne: RequestHandler = async (req, res, next) => {
  const reqUser = (req as IRequestWithUserPayload).user;
  const { user, title, description, startedAt, finishedAt, dateStr } = req.body as ICreateReportDto;
  const dto: ICreateReportDto = { user, title, description, startedAt, finishedAt, dateStr };
  const id = req.params.id as string;

  if (reqUser.id !== user) return res.status(403).send({ error: 'Forbidden' });

  try {
    const isAllowed = reportsService.isAllowedDate(dateStr);

    if (!isAllowed) return res.status(403).send({ error: `Forbidden. Report is not allowed to edit` });

    await reportsService.updateOne(id, dto);
    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

export const deleteOne: RequestHandler = async (req, res, next) => {
  const user = (req as IRequestWithUserPayload).user;
  const id = req.params.id as string;

  if (!mongoose.isValidObjectId(id)) return res.status(400).send({ error: 'Invalid report id' });

  try {
    const report = await Report.findById(id);

    if (!report) return res.status(404).send({ error: 'Not Found' });
    if (report.user.toString() !== user.id) return res.status(403).send({ error: 'Forbidden' });

    const isAllowed = reportsService.isAllowedDate(report.dateStr);
    if (!isAllowed) return res.status(403).send({ error: `Forbidden. Report is not allowed to delete` });

    await reportsService.deleteOne(id);
    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};
