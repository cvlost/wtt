import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from '../middleware/error-handler';
import config from '../config';

const app = express();

app.use(cors({ credentials: true, origin: config.clientUrl }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

app.get('/', async (req: Request, res: Response) => {
  return res.status(200).send({ message: 'Hello World!' });
});

app.use(errorHandler);

export default app;
