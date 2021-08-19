import express , { Request, Response} from 'express';
import { body } from 'express-validator';
import { NotFoundError, requireAuth, validationRequest , OrderStatus, BadRequestError } from '@goodmanzticket/common';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';


import   mongoose   from 'mongoose';
// import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
// import { natsWrapper } from '../ntas-wrapper';

const router  = express.Router(); 
const EXP_WINDOW_SECOND = 1* 60 ;  

router.post('/api/orders' ,requireAuth , 
    [body('ticketId')
        .not()
        .isEmpty() 
        .custom((input:string ) =>  mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticketid must be provided')],
    validationRequest,
    async ( req:Request, res: Response ) => { 
         const { ticketId } = req.body 
         const ticket = await Ticket.findById(ticketId);

         if(!ticket){
            throw new NotFoundError(); 
         }
         const isReserved = await ticket.isReserved(); 

         
         if (isReserved) { 
             throw new BadRequestError('Ticket is already reserved'); 
         }

         const expiration = new Date(); 
         expiration.setSeconds( expiration.getSeconds() + EXP_WINDOW_SECOND );

         const order = Order.build ( { 
             userId : req.currentUser!.id, 
             status: OrderStatus.Created, 
             expireAt: expiration, 
             ticket
         });

         await order.save(); 

         new OrderCreatedPublisher( natsWrapper.client).publish({
             id: order.id, 
             version: order.version,
             status : order.status , 
             userId : order.userId, 
             expiresAt: order.expireAt.toISOString(),
             ticket: { 
                 id: ticket.id, 
                 price : ticket.price 
             }
         });;

         res.status(201).send(order);

    })

export { router as newOrderRouter };
