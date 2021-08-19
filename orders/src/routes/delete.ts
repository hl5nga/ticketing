import express , { Request, Response} from 'express';
const router  = express.Router(); 
import {  NotAuthorizedError, NotFoundError, OrderStatus, requireAuth  } from '@goodmanzticket/common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

router.delete('/api/orders/:orderId' ,requireAuth ,  async ( req:Request, res: Response ) => { 
    
    const { orderId } = req.params; 
    const order = await Order.findById(orderId);
    if (!order) { 
        throw new NotFoundError(); 
    }
    if (order.userId !== req.currentUser!.id){ 
        throw new NotAuthorizedError(); 
    }
    order.status = OrderStatus.Cancelled; 
    await order.save(); 

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id, 
        version: order.version, 
        ticket: { 
            id: order.ticket.id, 
          
        }
    })


    res.status(204).send();
})

export { router as deleteOrderRouter };
