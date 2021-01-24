import * as amqp from 'amqplib/callback_api';
import { environment } from '../environments/environment';

async function setupRabbitMQConnection(): Promise<amqp.Connection> {
  const {
      hostname,
      port,
      username,
      password,
      exchanges,
      queues,
      routingKeys
   } = environment.rabbitMQ;
  const rabbitConnection: amqp.Connection = await new Promise(
    (resolve, reject) => {
      amqp.connect(
        {
          hostname,
          port,
          username,
          password
        },
        (err, connection) => {
          if (err) reject(err);

          resolve(connection);
        }
      );
    }
  );

  const channel: amqp.Channel = await new Promise((resolve, reject) => {
    rabbitConnection.createChannel((err, channel) => {
      if (err) reject(err);

      resolve(channel);
    });
  });

  await channel.assertExchange(exchanges.delayed, 'x-delayed-message', {
    durable: true,
    arguments: { 'x-delayed-type': 'direct' },
  });
  await channel.assertQueue(queues.managerTrigger, { durable: true });
  await channel.bindQueue(
    queues.managerTrigger,
    exchanges.delayed,
    routingKeys.managerTrigger
  );

  return rabbitConnection;
}

export default setupRabbitMQConnection;
