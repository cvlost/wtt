import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const config = {
  publicPath: path.join(__dirname, 'public'),
  port: Number(process.env.PORT) || 10000,
  db: process.env.DB_URL || 'mongodb://localhost/work-time-tracker',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  clientUrl: process.env.CLIENT_URL || '',
};

export default config;
