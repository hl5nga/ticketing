import { Message } from 'node-nats-streaming';
import { Publisher , TicketCreatedEvnet , Subjects  } from '@goodmanzticket/common';


export  class TicketCreatedPublisher extends Publisher <TicketCreatedEvnet> {
    readonly subject = Subjects.TicketCreated;
   
   
  }
  