import { Message } from "node-nats-streaming";
import { Subjects ,  Listener, OrderCancelledEvent, OrderStatus} from "@goodmanzticket/common";
//import { Ticket    } from '../../models/ticket';
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
//import { TicketUpdatedPublisher } from "../publishers/ticket-update-publisher";
 
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName ; 
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        //console.log(data);
        const order = await Order.findOne ( { _id: data.id , version :   0 } );
        //console.log(order);
        if (!order){
            throw new Error('Order not found');
        }
        order.set( { status : OrderStatus.Cancelled });
        await order.save(); 
               
        msg.ack(); 
    }
}
