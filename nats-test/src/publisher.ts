import { errorMonitor } from 'events';
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher} from './events/ticket-created-publisher';
console.clear(); 

const stan = nats.connect('ticketing', 'abc', 
    {url: 'http://localhost:4222'});
    stan.on('connect', async () => { 
        console.log('Publisher connected to NATS 4222');
        
        const publisher = new TicketCreatedPublisher(stan);
        try { 
            await publisher.publish({
                id: '123', 
                title : 'test',
                price: 23.4
            });
        } catch(err) {
            console.error(err);
        }
    });
