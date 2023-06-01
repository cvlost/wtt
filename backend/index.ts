import mongoose from 'mongoose';
import config from './config';
import usersRouter from './routes/users';
import app from './app/app';
import reportsRouter from './routes/reports';

app.use('/api/users', usersRouter);
app.use('/api/reports', reportsRouter);

const run = async () => {
  await mongoose.connect(config.db);
  app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
  process.on('exit', () => mongoose.disconnect());
};

run().catch(console.error);
