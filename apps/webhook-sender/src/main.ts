import * as express from 'express';
import { getChannel, setupRabbitMQConnection } from '@webhook-sender/queue';
import TriggerController from './app/controllers/trigger.controller';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/health-check', (req, res) => {
  res.send({ message: 'webhook-sender works' });
});

setupRabbitMQConnection()
  .then(async (conn) => {
    const channel = await getChannel(conn);

    const triggerController = new TriggerController(channel);

    const port = process.env.port || 80;
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/health-check`);
    });
    server.on('error', console.error);
  })
  .catch((err) => {
    console.error(err);
    console.error('Failed to connect to RabbitMQ service.');
    process.exit(1);
  });
