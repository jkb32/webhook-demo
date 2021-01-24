import * as express from 'express'
import SubscriptionController from '../controllers/subscription-controller';

const router = express.Router({mergeParams: true});
const subscriptionController = new SubscriptionController();

router.post('/', subscriptionController.addSubscription);

export default router;