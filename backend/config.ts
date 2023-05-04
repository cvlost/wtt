import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  port: Number(process.env.PORT) || 10000,
  db: process.env.DB_URL || 'mongodb://localhost/work-time-tracker',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
};

export default config;
