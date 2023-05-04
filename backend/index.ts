import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import usersRouter from './routes/users';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

app.get('/api', (req, res) => {
  res.send({ message: 'It works!' });
});

app.use('/api/users', usersRouter);

const run = async () => {
  await mongoose.connect(config.db);
  app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
  process.on('exit', () => mongoose.disconnect());
};

run().catch(console.error);
