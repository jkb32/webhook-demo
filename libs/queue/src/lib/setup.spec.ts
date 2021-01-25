import { setupRabbitMQConnection } from './setup';

const mockChannel = {
  assertExchange: jest.fn((name, type, options, cb) => cb()),
  assertQueue: jest.fn((name, options, cb) => cb()),
  bindQueue: jest.fn((queue, exchange, routingKey, args, cb) => cb()),
};

const mockConnection = {
  createChannel: jest.fn((cb) => cb(null, mockChannel)),
};

jest.mock('amqplib/callback_api', () => ({
  connect: jest.fn((url, callback) => {
    callback(null, mockConnection);
  }),
}));

describe('setupRabbitMQConnection()', () => {
  it('should work', async () => {
    const result = await setupRabbitMQConnection();

    expect(result).toBe(mockConnection);
    expect(mockChannel.assertExchange).toBeCalled();
    expect(mockChannel.assertQueue).toBeCalled();
    expect(mockChannel.bindQueue).toBeCalled();
  });
});
