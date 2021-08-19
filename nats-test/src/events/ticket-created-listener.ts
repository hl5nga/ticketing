import { Message } from 'node-nats-streaming';
import { Listener , TicketCreatedEvnet , Subjects } from '@goodmanzticket/common';


export  class TicketCreatedListener extends Listener <TicketCreatedEvnet> {
    //subject : Subjects.TicketCreated  = Subjects.TicketCreated ;
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';
  
    onMessage(data: TicketCreatedEvnet['data'], msg: Message) {
      console.log('Event data!', data);
      console.log ( 
        data.id, 
        data.title,
        data.price
      );
  
      msg.ack();
    }
  }
  