import cors from 'cors';
import express from 'express';
import * as mongoose from 'mongoose';
import config from './config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send({ message: 'It works!' });
});

const run = async () => {
  await mongoose.connect(config.db);
  app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
  process.on('exit', () => mongoose.disconnect());
};

run().catch(console.error);
