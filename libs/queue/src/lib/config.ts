import { Options } from 'amqplib';
import AssertExchange = Options.AssertExchange;
import AssertQueue = Options.AssertQueue;
import Connect = Options.Connect;

const WEBHOOK_TRIGGERS_EXCHANGE = 'webhook-triggers-exchange';
const WEBHOOK_TRIGGERS_QUEUE = 'webhook-triggers-queue';
const WEBHOOK_TRIGGERS_ROUTING_KEY = 'webhook-triggers-routing-key';

export const connectionConfig: Connect = {
  hostname: process.env.RABBITMQ_URL || 'localhost',
  port: Number(process.env.RABBITMQ_PORT) || 5672,
  username: process.env.RABBITMQ_USERNAME || 'rabbitmq',
  password: process.env.RABBITMQ_PASSWORD || 'rabbitmq',
};

export interface Exchange {
  name: string;
  type: string;
  options: AssertExchange;
}

export interface Queue {
  name: string;
  options: AssertQueue;
}

export interface Binding {
  queue: string;
  exchange: string;
  routingKey: string;
}

interface QueueConfig {
  exchanges: {
    [key: string]: Exchange;
  };
  queues: {
    [key: string]: Queue;
  };
  bindings: {
    [key: string]: Binding;
  };
}

export const queueConfig: QueueConfig = {
  exchanges: {
    webhookTriggersExchange: {
      name: WEBHOOK_TRIGGERS_EXCHANGE,
      type: 'x-delayed-message',
      options: {
        durable: true,
        arguments: { 'x-delayed-type': 'direct' },
      },
    },
  },
  queues: {
    webhookTriggers: {
      name: WEBHOOK_TRIGGERS_QUEUE,
      options: {
        durable: true,
      },
    },
  },
  bindings: {
    webhookTriggers: {
      queue: WEBHOOK_TRIGGERS_QUEUE,
      exchange: WEBHOOK_TRIGGERS_EXCHANGE,
      routingKey: WEBHOOK_TRIGGERS_ROUTING_KEY,
    },
  },
};
