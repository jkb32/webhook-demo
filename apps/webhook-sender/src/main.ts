/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as amqp from 'amqplib/callback_api';
import { WebhookMessage } from '@webhook-demo/interfaces';
import { environment } from './environments/environment';

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to webhook-sender!' });
});

const opt = amqp.credentials.plain('rabbitmq', 'rabbitmq');
amqp.connect(
  {
    hostname: environment.rabbitMQ.hostname,
    port: environment.rabbitMQ.port,
    username: environment.rabbitMQ.username,
    password: environment.rabbitMQ.password,
  },
  function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      const queue = 'webhooks';

      console.log(
        ' [*] Waiting for messages in %s. To exit press CTRL+C',
        queue
      );
      channel.consume(
        queue,
        function (msg) {
          console.log(' [x] Received %s', msg.content.toString());
        },
        {
          noAck: true,
        }
      );
    });
  }
);

app.get('/trigger', (req, res) => {
  const opt = amqp.credentials.plain('rabbitmq', 'rabbitmq');
  amqp.connect(
    {
      hostname: environment.rabbitMQ.hostname,
      port: environment.rabbitMQ.port,
      username: environment.rabbitMQ.username,
      password: environment.rabbitMQ.password,
    },
    function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }

        const queue = 'webhooks';

        const msg: WebhookMessage = {
          message: `Hello, world! ${Date.now()}`,
          timestamp: Date.now(),
        };

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));

        console.log(' [x] Sent %s', msg);
        res.send({
          message: 'Webhook triggered!',
          summary: msg,
        });
      });
      setTimeout(function () {
        connection.close();
      }, 500);
    }
  );
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
