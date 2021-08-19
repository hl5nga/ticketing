import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

import { OrderCreatedListener } from './events/listener/order-created-listener';
import { OrderCancelledListener } from './events/listener/order-cancelled-listener';


const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLUSTERID) {
    throw new Error('NATS_CLUSTERID must be defined');
  }
  if (!process.env.NATS_CLIENTID) {
    throw new Error('NATS_CLIENTID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
 
  try {
    await  natsWrapper.connect( process.env.NATS_CLUSTERID ,  process.env.NATS_CLIENTID  , process.env.NATS_URL )
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb in Tickets API');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
