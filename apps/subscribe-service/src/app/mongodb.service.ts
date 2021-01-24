import { environment } from '../environments/environment';
import { Db, MongoClient } from 'mongodb';
import { SubscriptionSchema } from '@webhook-demo/interfaces';

const USERNAME = environment.mongo.user;
const PASSWORD = environment.mongo.password;
const HOSTNAME = environment.mongo.hostname;
const PORT = environment.mongo.port;

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
    this.mongoClient = new MongoClient(
      `mongodb://${USERNAME}:${PASSWORD}@${HOSTNAME}:${PORT}/webhooks?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      }
    );
  }

  public async init() {
    const client = await this.mongoClient.connect();
    console.log("MongoDB connection established.");
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
}
