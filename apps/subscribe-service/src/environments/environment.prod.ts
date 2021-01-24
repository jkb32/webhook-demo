export const environment = {
  production: true,
  mongo: {
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    hostname: process.env.MONGO_HOSTNAME,
    port: process.env.MONGP_PORT
  }
};
