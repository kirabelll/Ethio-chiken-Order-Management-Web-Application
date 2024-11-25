import { config as conf } from 'dotenv-safe';

conf();

const _config = {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
};
export const config = Object.freeze(_config);
