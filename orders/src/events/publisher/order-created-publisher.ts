import { Publisher , OrderCreatedEvent , Subjects } from '@goodmanzticket/common';

export class OrderCreatedPublisher extends Publisher <OrderCreatedEvent> { 
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}