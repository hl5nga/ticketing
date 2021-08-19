import { Publisher , TicketCreatedEvnet , Subjects  } from '@goodmanzticket/common'; 

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvnet> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated


}

