import * as express from 'express';
import * as amqp from 'amqplib';

const app = express();

amqp.connect('amqp://localhost', function(error0, connection) {});

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to subscribe-service!' });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
