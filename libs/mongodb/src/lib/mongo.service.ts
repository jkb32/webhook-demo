import { Cursor, Db, MongoClient } from 'mongodb';
import { connectionConfig } from './config';
import { SubscriptionSchema } from '@webhook-sender/interfaces';

export class MongoService {
  private mongoClient: MongoClient;
  private db: Db;
  private static instance: MongoService;

  static get() {
    if (!MongoService.instance) {
      MongoService.instance = new MongoService();
    }

    return MongoService.instance;
  }

  private constructor() {
    const { user, password, hostname, port } = connectionConfig;
    this.mongoClient = new MongoClient(
      `mongodb://${user}:${password}@${hostname}:${port}/webhooks?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      }
    );
  }

  public async init() {
    const client = await this.mongoClient.connect();
    console.log('MongoDB connection established.');
    this.db = client.db();
  }

  public async addSubscriptions(subscription: SubscriptionSchema) {
    return this.mongoClient
      .db()
      .collection('subscriptions')
      .insertOne(subscription);
  }

  public async removeSubscription(url: string) {
    return this.mongoClient.db().collection('subscriptions').deleteOne({ url });
  }

  public async find(url: string) {
    return this.mongoClient.db().collection('subscriptions').findOne({ url });
  }

  public async getSubscriptions(): Promise<Cursor<SubscriptionSchema>> {
    return this.mongoClient.db().collection('subscriptions').find();
  }
}
