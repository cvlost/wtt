import { RequestHandler } from 'express';
import { IRequestWithUserPayload } from '../types';
import { Forbidden, Unauthorized } from '../errors/errors';

export const permit = (...roles: string[]): RequestHandler => {
  return (expressReq, res, next) => {
    const req = expressReq as IRequestWithUserPayload;

    if (!req.user) throw new Unauthorized();
    if (!roles.includes(req.user.role)) throw new Forbidden();

    return next();
  };
};
