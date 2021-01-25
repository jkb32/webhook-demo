import * as express from 'express';
import SubscriptionController from './app/controllers/subscription-controller';
import { MongoService } from '@webhook-sender/mongodb';
import { getChannel, setupRabbitMQConnection } from '@webhook-sender/queue';
import TriggerController from './app/controllers/trigger.controller';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

console.log(process.env.toString());

const mongoService = MongoService.get();

Promise.all([setupRabbitMQConnection(), mongoService.init()]).then(
  async ([connection]) => {
    const channel = await getChannel(connection);

    app.use(new SubscriptionController().router);
    app.use(new TriggerController(channel).router);

    app.get('/health-check', (req, res) => {
      res.send({ message: 'subscription-manager works' });
    });

    const port = process.env.port || 80;
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/health-check`);
    });
    server.on('error', console.error);
  }
);
