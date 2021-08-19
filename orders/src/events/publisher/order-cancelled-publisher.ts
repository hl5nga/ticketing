import { Subjects, Publisher, OrderCancelledEvent } from '@goodmanzticket/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
