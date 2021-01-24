import * as express from 'express';
import { MongoService } from './app/mongodb.service';

const app = express();
app.use(express.json());

const mongoService = new MongoService();

app.post('/subscribe', async (req, res) => {
  const body = req.body;
  const result = await mongoService.addSubscriptions({
    url: body.url,
    secret: body.secret
  });

  console.log("%s", result);

  res.send(result);
});


app.get('/subscribe', async (req, res) => {
  const url = req.query.url as string;
  const result = await mongoService.find(url);

  console.log("%s", result);

  res.send(result);
});


app.delete('/subscribe', async (req, res) => {
  const url = req.query.url as string;
  const result = await mongoService.removeSubscription(url);

  console.log("%s", result);

  res.send(result);
});





const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
