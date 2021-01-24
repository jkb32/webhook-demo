import * as express from 'express';
import subscriptionRouter from './app/routers/subscription-router';
import axios from 'axios';

const app = express();

// Body parser configuration
app.use(express.json());

app.use('/subscriptions', subscriptionRouter);

app.get('/api', (req, res) => {
  Promise.all([
    axios.get<{ message: string }>('http://subscribe-service:3333/api'),
    axios.get<{ message: string }>('http://webhook-sender:3333/api'),
  ])
    .then(([subscribeService, webhookSender]) => {
      res.send({
        subscribeSender: subscribeService.data.message,
        webhookSender: webhookSender.data.message,
      });
    })
    .catch((err) => {
      res.send({ error: err });
    });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
