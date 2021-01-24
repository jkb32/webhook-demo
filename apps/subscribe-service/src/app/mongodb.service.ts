import { environment } from '../environments/environment';
import { MongoClient } from 'mongodb';
import { SubscriptionSchema } from '@webhook-demo/interfaces';

const USERNAME = environment.mongo.user;
const PASSWORD = environment.mongo.password;
const HOSTNAME = environment.mongo.hostname;
const PORT = environment.mongo.port;

export class MongoService {
  private mongoClient: MongoClient;

  constructor() {
    this.mongoClient = new MongoClient(
      `mongodb://${USERNAME}:${PASSWORD}@${HOSTNAME}:${PORT}/webhooks?retryWrites=true&w=majority`
    );
  }

  public async addSubscriptions(subscription: SubscriptionSchema) {
    await this.mongoClient.connect();
    return this.mongoClient.db().collection('subscriptions').insertOne(subscription);
  }

  public async removeSubscription(url: string) {
    await this.mongoClient.connect();
    return this.mongoClient.db().collection('subscriptions').deleteOne({ url });
  }

  public async find(url: string) {
    await this.mongoClient.connect();
    return this.mongoClient.db().collection('subscriptions').findOne({ url });
  }
}
