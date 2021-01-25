import { queueConfig } from '@webhook-sender/queue';
import { TriggerDto } from '@webhook-sender/interfaces';
import SenderService from '../services/sender.service';
import * as amqp from 'amqplib/callback_api';
import { AxiosError } from 'axios';

const SECONDS_TO_MILISECONDS = 1000;

const { queues, bindings } = queueConfig;

class TriggerController {
  constructor(private channel: amqp.Channel) {
    channel.consume(
      queues.webhookTriggers.name,
      (message) => {
        this.handleTrigger(message);
      },
      {
        noAck: false,
      }
    );

    console.log(
      `TriggerController listening for queue: ${queues.webhookTriggers.name}.`
    );
  }

  private async handleTrigger(message: amqp.Message) {
    const trigger: TriggerDto = JSON.parse(message.content.toString());

    await SenderService.sendWebhook(trigger)
      .then(() =>
        console.log(`Message delivered to: ${trigger.subscription.url}`)
      )
      .catch((err: AxiosError) => {
        const newDelayInSec = this.calculateDelay(trigger.delaySec);

        console.error(err.message);
        console.error(
          `Message failed to deliver message to url: ${trigger.subscription.url}, changed delay from ${trigger.delaySec} to ${newDelayInSec} seconds.`
        );

        this.channel.publish(
          bindings.webhookTriggers.exchange,
          bindings.webhookTriggers.routingKey,
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
    const maxDelayInSeconds = Number(process.env.MAX_DELAY_IN_SECONDS) || 600;
    return delay * 2 > maxDelayInSeconds ? maxDelayInSeconds : delay * 2;
  }
}
export default TriggerController;
