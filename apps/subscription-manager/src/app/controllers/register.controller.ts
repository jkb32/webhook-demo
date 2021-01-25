import * as express from 'express';
import { MongoService } from '@webhook-sender/mongodb';

class RegisterController {
  private mongoService: MongoService;
  public router = express.Router();
  public path = '/register';

  constructor() {
    this.mongoService = MongoService.get();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getSubscriptions);
    console.log(`GET ${this.path} initialized.`);
    this.router.post(this.path, this.addSubscription);
    console.log(`POST ${this.path} initialized.`);
    this.router.delete(this.path, this.removeSubscription);
    console.log(`DELETE ${this.path} initialized.`);
  }

  public addSubscription = async (req, res) => {
    const body = req.body;
    const result = await this.mongoService.addSubscriptions({
      url: body.url,
      secret: body.secret,
    });

    console.log('%s', result);

    res.send(result);
  };

  public getSubscriptions = async (req, res) => {
    const url = req.query.url as string;
    const result = await this.mongoService.find(url);

    console.log('%s', result);

    res.send(result);
  };

  public removeSubscription = async (req, res) => {
    const url = req.query.url as string;
    const result = await this.mongoService.removeSubscription(url);

    console.log('%s', result);

    res.send(result);
  };
}

export default RegisterController;
