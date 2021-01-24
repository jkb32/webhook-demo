import { ObjectID } from "mongodb";
import { SubscriptionSchema } from "./mongo";

export interface TriggerDto {
    subscription: SubscriptionSchema,
    message: string,
    delaySec: number
};


// {"subscription": {"url": "test","secret": "secret"}, "message": "Hello", "delaySec": 1}