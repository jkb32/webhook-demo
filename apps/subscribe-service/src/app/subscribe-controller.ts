import * as express from 'express';
import { MongoService } from './mongodb.service';

class SubscribeController {
  private mongoService: MongoService;
  public router = express.Router();
  public path = '/subscribe';

  constructor() {
    this.mongoService = MongoService.get();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getSubscription);
    this.router.post(this.path, this.addSubscription);
    this.router.delete(this.path, this.removeSubscription);
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

  public getSubscription = async (req, res) => {
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

export default SubscribeController;
