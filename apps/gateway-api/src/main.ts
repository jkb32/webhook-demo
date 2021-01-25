import * as express from 'express';
import dotenv from 'dotenv';
import SubscriptionController from './app/controllers/subscription-manager.controller';

dotenv.config();
const app = express();
app.use(express.json());


app.use(new SubscriptionController().router);

app.get('/health-check', (req, res) => {
  res.send({ message: 'gateway-api works' });
});

const port = process.env.port || 80;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/health-check`);
});
server.on('error', console.error);
