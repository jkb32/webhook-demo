export const connectionConfig = {
  user: process.env.MONGO_INITDB_USERNAME || 'dev_user',
  password: process.env.MONGO_INITDB_PASSWORD || 'dev_password',
  hostname: process.env.MONGO_URL || 'localhost',
  port: Number(process.env.MONGO_PORT) || 27017,
};
