import { RequestHandler } from 'express';
import { validateAccessToken } from '../services/jwt-service';
import { IRequestWithUserPayload } from '../types';
import { Unauthorized } from '../errors/errors';

const auth: RequestHandler = (expressReq, res, next) => {
  const req = expressReq as IRequestWithUserPayload;

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) throw new Unauthorized();

  const accessToken = authorizationHeader.split(' ')[1];
  if (!accessToken) throw new Unauthorized();

  const userPayload = validateAccessToken(accessToken);
  if (!userPayload) throw new Unauthorized();

  req.user = userPayload;
  return next();
};

export default auth;
