import { OrderCreatedListener } from './events/listeners/order-created-listener'; 
 
import { natsWrapper } from './nats-wrapper';
 
const start = async () => {
   
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

  } catch (err) {
    console.error(err);
  }
 
};

start();
