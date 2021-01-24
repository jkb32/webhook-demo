import { TriggerDto } from "@webhook-demo/interfaces";
import axios from "axios";

class WebhookService {
    static async sendWebhook({ subscription, message }: TriggerDto) {
        return axios.post(subscription.url, {
            message: message,
            secret: subscription.secret
        });
    }
}

export default WebhookService;