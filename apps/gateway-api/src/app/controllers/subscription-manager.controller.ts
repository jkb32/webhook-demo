import * as express from 'express';
import SubscriptionManagerService from '../services/subscription-manager.service';
import { body as validateBody, validationResult } from 'express-validator';

export default class SubscriptionController {
  public router = express.Router();
  public path = '/subscription';

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/health-check`, this.healthCheck);
    console.log(`GET ${this.path}/health-check routed.`);
    this.router.post(`${this.path}/register`, validateBody('url', 'secret').notEmpty().isURL(), this.registerSubscription);
    console.log(`POST ${this.path}/register routed.`);
    this.router.post(`${this.path}/trigger`, validateBody('message').notEmpty().isString(), this.sendTrigger);
    console.log(`POST ${this.path}/trigger routed.`);
  }

  public healthCheck = async (req, res) => {
    const response = await SubscriptionManagerService.healthCheck();
    res.send(response.data);
  };

  public registerSubscription = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { url, secret } = req.body;
      const response = await SubscriptionManagerService.postSubscription(
        url,
        secret
      );
      res.send(response.data);
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  public sendTrigger = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { message } = req.body;
      const response = await SubscriptionManagerService.sendTrigger(
        message
      );
      res.send(response.data);
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
