import { ObjectID } from 'mongodb';

export interface SubscriptionSchema {
  _id?: ObjectID;
  url: string;
  secret: string;
}
