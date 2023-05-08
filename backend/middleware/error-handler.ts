import { ErrorRequestHandler } from 'express';
import { ServerError } from '../errors/errors';

export const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  if (err instanceof ServerError) return res.status(err.statusCode).send(err);

  return next(err);
};
