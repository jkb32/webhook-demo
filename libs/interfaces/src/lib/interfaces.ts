export interface SubscriptionSchema {
  url: string;
  secret: string;
}

export interface TriggerDto {
  subscription: SubscriptionSchema;
  message: string;
  delaySec: number;
}

// {"subscription": {"url": "test","secret": "secret"}, "message": "Hello", "delaySec": 1}
