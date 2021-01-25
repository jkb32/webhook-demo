import * as amqp from 'amqplib/callback_api';
import {
  Binding,
  connectionConfig,
  Exchange,
  Queue,
  queueConfig,
} from './config';

const SECONDS_TO_MILLISECONDS = 1000;

export async function setupRabbitMQConnection(): Promise<amqp.Connection> {
  const { exchanges, queues, bindings } = queueConfig;

  const rabbitConnection = await getConnection(connectionConfig);
  const channel = await getChannel(rabbitConnection);
  await assertExchange(channel, exchanges.webhookTriggersExchange);
  await assertQueue(channel, queues.webhookTriggers);
  await bindQueue(channel, bindings.webhookTriggers);

  console.log('RabbitMQ connection established.');

  return rabbitConnection;
}

// Current Types for the amqp lib do not implement promise API, so these are simple wrappers

export async function getConnection({
  hostname,
  port,
  username,
  password,
}: amqp.Options.Connect): Promise<amqp.Connection> {
  return new Promise((resolve, reject) => {
    amqp.connect(
      {
        hostname,
        port,
        username,
        password,
      },
      {
        timeout: 60 * SECONDS_TO_MILLISECONDS
      },
      (err, connection) => {
        if (err) reject(err);

        resolve(connection);
      }
    );
  });
}

export async function getChannel(
  connection: amqp.Connection
): Promise<amqp.Channel> {
  return new Promise((resolve, reject) => {
    connection.createChannel((err, channel) => {
      if (err) reject(err);

      resolve(channel);
    });
  });
}

export async function assertExchange(
  channel: amqp.Channel,
  exchange: Exchange
) {
  return new Promise((resolve, reject) => {
    channel.assertExchange(
      exchange.name,
      exchange.type,
      exchange.options,
      (err, exchange) => {
        if (err) reject(err);
        resolve(exchange);
      }
    );
  });
}

export async function assertQueue(channel: amqp.Channel, queue: Queue) {
  return new Promise((resolve, reject) => {
    channel.assertQueue(queue.name, queue.options, (err, queue) => {
      if (err) reject(err);
      resolve(queue);
    });
  });
}

export async function bindQueue(channel: amqp.Channel, binding: Binding) {
  return new Promise((resolve, reject) => {
    channel.bindQueue(
      binding.queue,
      binding.exchange,
      binding.routingKey,
      {},
      (err, binding) => {
        if (err) reject(err);
        resolve(binding);
      }
    );
  });
}
