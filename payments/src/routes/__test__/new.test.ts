import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { OrderStatus } from '@goodmanzticket/common';
// import { Ticket  } from '../../models/ticket';
import { Order   } from '../../models/order';
// import { natsWrapper } from '../../nats-wrapper';

import { stripe} from '../../stripe';
import { Payment } from '../../models/payments'

 jest.mock('../../stripe');
 
// it('400 when purchase canceled order ' , async () => { 
//     const userId = mongoose.Types.ObjectId().toHexString();
    
//     const order = Order.build({ 
//         id: mongoose.Types.ObjectId().toHexString(), 
//         userId: userId, 
//         version: 0 , 
//         price: 20 ,
//        status : OrderStatus.Created
//     })
//     await order.save();
//     expect(201)

//     await request(app) 
//         .post('/api/payments')
//         .set ('Cookie' , global.signin(userId))
//         .send({ 
//             orderId: order.id, 
//             token: 'dsds'
//         })
//         .expect(400);
    
// })
 
it( 'return 204 with valid' , async () => { 
    const userId = mongoose.Types.ObjectId().toHexString();
    
    const order = Order.build({ 
        id: mongoose.Types.ObjectId().toHexString(), 
        userId: userId, 
        version: 0 , 
        price: 20 ,
        status : OrderStatus.Created
    })
    await order.save();
     
    await  request(app) 
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token :'tok_visa', 
            orderId : order.id, 
        })
     
    
        const chargeOptions = (stripe.charges.create as jest.Mock ).mock.calls[0][0]
        expect ( chargeOptions.source).toEqual('tok_visa')
        
})

