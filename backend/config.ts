import * as dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config({ path: '.env' });
}

const config = {
  publicPath: path.join(__dirname, 'public'),
  imageDir: process.env.IMAGE_DIR || 'images',
  port: Number(process.env.PORT) || 10000,
  db: process.env.DB_URL || 'mongodb://localhost/work-time-tracker',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  clientUrl: process.env.CLIENT_URL || '',
};

export default config;
