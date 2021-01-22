/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import axios from 'axios';

const app = express();

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
