export const EnvConfiguration = () => ({
  NODE_ENV: process.env.NODE_ENV || 'dev',
  // server
  PORT: process.env.PORT || 3002,
  HOST_API: process.env.HOST_API,
  DEFAULT_LIMIT: process.env.DEFAULT_LIMIT ? +process.env.DEFAULT_LIMIT : 5,
  LOG_HTTP_REQUEST: process.env.LOG_HTTP_REQUEST,
  // postgres
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  // auth
  JWT_SECRET: process.env.JWT_SECRET,
  // mongodb
  MONGO_URL: process.env.MONGO_URL,
  MONGODB_DATABASE: process.env.MONGODB_DATABASE,
  // mail
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM: process.env.MAIL_FROM,
  MAIL_PORT: process.env.MAIL_PORT,
  // redis
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  // websockets
  WS_PORT: process.env.WS_PORT,
  // mysql
  MYSQL_DB_PASSWORD: process.env.MYSQL_DB_PASSWORD,
  MYSQL_DB_NAME: process.env.MYSQL_DB_NAME,
  // rabbitmq
  RABBITMQ_HOST: process.env.RABBITMQ_HOST,
  RABBITMQ_PORT: process.env.RABBITMQ_PORT,
  RABBITMQ_PORT_MANAGEMENT: process.env.RABBITMQ_PORT_MANAGEMENT,
  RABBITMQ_USERNAME: process.env.RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
  RABBITMQ_VHOST: process.env.RABBITMQ_VHOST,
});

const config = EnvConfiguration();

export type EnvConfig = typeof config;
