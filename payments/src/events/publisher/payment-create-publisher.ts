import { Subjects , Publisher, PaymentCreatedEvent} from '@goodmanzticket/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> { 
     subject : Subjects.PaymentCreated = Subjects.PaymentCreated;
     
}