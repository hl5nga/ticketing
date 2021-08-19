import { Publisher ,  TicketUpdatedEvent , Subjects  } from '@goodmanzticket/common'; 

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated

}

