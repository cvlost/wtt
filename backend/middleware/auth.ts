import { RequestHandler } from 'express';
import { validateAccessToken } from '../services/jwtService';
import { IRequestWithUserPayload } from '../types';

const auth: RequestHandler = (expressReq, res, next) => {
  const req = expressReq as IRequestWithUserPayload;

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const userPayload = validateAccessToken(accessToken);
    if (!userPayload) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    req.user = userPayload;
    return next();
  } catch (e) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

export default auth;
