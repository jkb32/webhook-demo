import * as express from 'express';
import SubscribeController from './app/subscribe-controller';
import { MongoService } from './app/mongodb.service';

const app = express();
app.use(express.json());

async function setup() {
  const mongoService = MongoService.get();
  await mongoService.init();

  app.use(new SubscribeController().router);
}

setup().then(() => {
  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
})
