import axios from 'axios';

const baseUrl = process.env.SUBSCRIPRION_MANAGER_URL || 'subscription-manager';

export default class SubscriptionManagerService {
  static async healthCheck() {
    console.log(`http://${baseUrl}/health-check`);
    return axios.get(`http://${baseUrl}/health-check`);
  }

  static async postSubscription(url: string, secret: string) {
    return axios.post(`http://${baseUrl}/subscription`, {
      url,
      secret,
    });
  }

  static async sendTrigger(message: string) {
    return axios.post(`http://${baseUrl}/trigger`, {
      message,
    });
  }
}
