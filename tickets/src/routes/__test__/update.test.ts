import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket'

it ('return 404 if id does not existed' , async () => { 
    const id = new  mongoose.Types.ObjectId().toHexString();  
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title:'dasda', 
            price:20
        })
        .expect(404);
}); 

it ('return 401 if id does not auth' ,async () => { 
    const id = new  mongoose.Types.ObjectId().toHexString();  
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title:'dasda', 
            price:20
        })
        .expect(401);
}); 
it ('return 401 if user does not own ticket' , async() => { 
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title:'dasda', 
            price:20
        });
    
        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie' , global.signin())
            .send({
                title:'dasdsdfaa', 
                price:202
                })
            .expect(401);


}); 

it ('return 400 if user does invalid title and price' , async() => { 
    const cookie = global.signin() ;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title:'dasda', 
            price:20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send ( 
            {
                title:'', 
                price:0
            }
        )
        .expect(400);

}); 

it ('Updated ticket with valid input ' , async() => { 
    const cookie = global.signin() ;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title:'dasda', 
            price:20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send ( 
            {
                title:'thi is final ', 
                price: 250
            }
        )
        .expect(200);
    
    const ticresponse =  await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send ()        
    
        expect(ticresponse.body.title).toEqual('thi is final '); 
        expect(ticresponse.body.price).toEqual(250); 
}); 


it ('Reject update if ticket is reserved  ' , async() => { 
    const cookie = global.signin() ;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title:'dasda', 
            price:20
        });

        const ticket =  await Ticket.findById( response.body.id);
        ticket!.set({ orderId : mongoose.Types.ObjectId().toHexString()});
        await ticket!.save(); 

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send ( 
            {
                title:'thi is final ', 
                price: 250
            }
        )
        .expect(400);
    

 
}); 