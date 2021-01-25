import * as express from 'express';
import SubscriptionManagerService from '../services/subscription-manager.service';

export default class SubscriptionController {
  public router = express.Router();
  public path = '/subscription';

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/health-check`, this.healthCheck);
    console.log(`GET ${this.path}/health-check routed.`);
    this.router.post(`${this.path}/subscription`, this.postSubscription);
    console.log(`POST ${this.path}/subscription routed.`);
    this.router.post(`${this.path}/trigger`, this.sendTrigger);
    console.log(`POST ${this.path}/trigger routed.`);
  }

  public healthCheck = async (req, res) => {
    const response = await SubscriptionManagerService.healthCheck();
    res.send(response.data);
  };

  public postSubscription = async (req, res) => {
    const response = await SubscriptionManagerService.postSubscription(
      req.body.url,
      req.body.secret
    );
    res.send(response.data);
  };

  public sendTrigger = async (req, res) => {
    const response = await SubscriptionManagerService.sendTrigger(
      req.body.message
    );
    res.send(response.data);
  };
}
