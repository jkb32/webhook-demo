import * as express from 'express';
import { MongoClient } from 'mongodb';
import { environment } from './environments/environment';

const app = express();

const USERNAME = environment.mongo.user;
const PASSWORD = environment.mongo.password;
const URL = environment.mongo.url;


const client = new MongoClient(`mongodb://${USERNAME}:${PASSWORD}@${URL}/webhooks?retryWrites=true&w=majority`);

app.post('/subscribe', async ({ body }, res) => {

  await client.connect();

  const webhooks_database = await client.db();

  console.log("Databases:", webhooks_database.databaseName);

  res.send({ message: 'Welcome to subscribe-service!. Connected to ' + webhooks_database.databaseName });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
