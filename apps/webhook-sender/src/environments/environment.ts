export const environment = {
  production: false,
  rabbitMQ: {
    hostname: 'localhost',
    port: 5672,
    username: 'rabbitmq',
    password: 'rabbitmq',

    exchanges: {
      delayed: 'webhooks-delayed-exchange'
    },
    queues: {
      managerTrigger: 'managerTriggerQueue',
      gatewayTrigger: 'gatewayTriggerQueue'
    },
    routingKeys: {
      gatewayTrigger: 'gateway.trigger',
      gatewaySubscriptionAdd: 'gateway.subscription.add',
      managerTrigger: 'manager.trigger'
    },

    maxDelayInSeconds: 600
  },
};
