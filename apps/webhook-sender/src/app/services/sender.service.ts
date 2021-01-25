import axios, { AxiosResponse } from 'axios';
import { TriggerDto } from '@webhook-sender/interfaces';

export default class SenderService {
  static async sendWebhook({
    subscription,
    message,
  }: TriggerDto): Promise<AxiosResponse<never>> {
    return axios.post(
      subscription.url,
      {
        message,
      },
      {
        headers: {
          Authorization: 'Bearer ' + subscription.secret,
        },
      }
    );
  }
}
