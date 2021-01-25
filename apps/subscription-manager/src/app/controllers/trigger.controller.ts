import { queueConfig } from '@webhook-sender/queue';
import { TriggerDto } from '@webhook-sender/interfaces';
import * as amqp from 'amqplib/callback_api';
import * as express from 'express';
import { Response } from 'express';
import { MongoService } from '@webhook-sender/mongodb';

const { bindings } = queueConfig;

class TriggerController {
  private mongoService: MongoService;
  public router = express.Router();
  public path = '/trigger';

  constructor(private readonly channel: amqp.Channel) {
    this.mongoService = MongoService.get();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path, this.sendTrigger);
    console.log(`POST ${this.path} initialized.`);
  }

  private sendTrigger = async ({ body }, res: Response) => {
    const subscriptionsCursor = await this.mongoService.getSubscriptions();

    const triggerPromises = [];

    await subscriptionsCursor.forEach((subscription) => {
      triggerPromises.push(
        new Promise((resolve, reject) => {
          const trigger: TriggerDto = {
            subscription,
            message: body.message,
            delaySec: 1,
          };

          const success = this.channel.publish(
            bindings.webhookTriggers.exchange,
            bindings.webhookTriggers.routingKey,
            Buffer.from(JSON.stringify(trigger))
          );

          console.log(success);

          success ? resolve() : reject();
        })
      );
    });

    return Promise.all(triggerPromises)
      .then(() => {
        console.log(`Triggers sent with messsage: ${body.message}`);
        return res.send({
          success: true,
          message: 'Triggers sent.',
        });
      })
      .catch(() => {
        return res.status(500).send({
          success: false,
          error: 'Could not send trigger message to queue',
        });
      });
  };
}

export default TriggerController;
