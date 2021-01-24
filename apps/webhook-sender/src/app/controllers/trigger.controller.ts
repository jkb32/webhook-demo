import { TriggerDto } from '@webhook-demo/interfaces';
import { Channel, Message } from 'amqplib/callback_api';
import { environment } from '../../environments/environment';
import WebhookService from '../services/webhook.service';

const {
  queues,
  exchanges,
  maxDelayInSeconds,
  routingKeys,
} = environment.rabbitMQ;

const SECONDS_TO_MILISECONDS = 1000;

class TriggerController {
  constructor(private channel: Channel) {
    channel.consume(
      queues.managerTrigger,
      (message) => {
        this.handleTrigger(message);
      },
      {
        noAck: false,
      }
    );
  }

  public async handleTrigger(message: Message) {
    const trigger: TriggerDto = JSON.parse(message.content.toString());

    await WebhookService.sendWebhook(trigger)
      .then(() => {
        console.log(`Message delivered to: ${trigger.subscription.url}`);
      })
      .catch((err) => {
        const newDelayInSec = this.calculateDelay(trigger.delaySec);
        console.error(
          `Message failed to deliver on ${trigger.subscription.url}, changed delay from ${trigger.delaySec} to ${newDelayInSec}`
        );

        this.channel.publish(
          exchanges.delayed,
          routingKeys.managerTrigger,
          Buffer.from(
            JSON.stringify({
              ...trigger,
              delaySec: newDelayInSec,
            })
          ),
          { headers: { 'x-delay': newDelayInSec * SECONDS_TO_MILISECONDS } }
        );
      });

    this.channel.ack(message);
  }

  private calculateDelay(delay: number): number {
    return delay * 2 > maxDelayInSeconds ? maxDelayInSeconds : delay * 2;
  }
}

export default TriggerController;
