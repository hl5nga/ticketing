import { Message } from "node-nats-streaming";
import { Subjects ,  Listener, OrderCreatedEvent} from "@goodmanzticket/common";
import { Ticket    } from '../../models/ticket';
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-update-publisher";
 
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName ; 
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket){
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: data.id });
        await ticket.save(); 
        console.log('OrderCreatedListener::Saved Ticket');
        await new TicketUpdatedPublisher(this.client).publish ({
             id: ticket.id, 
             price: ticket.price, 
             title: ticket.title, 
             userId: ticket.userId, 
             orderId: ticket.orderId, 
             version: ticket.version
         }) ;  // Listen and Publisher again 
         console.log('OrderCreatedListener::Published back');
        msg.ack(); 
    }
}
