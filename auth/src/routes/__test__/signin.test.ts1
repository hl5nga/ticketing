import request from 'supertest'; 
import {app} from '../../app'

it('sign in' , async() => { 
    await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com1', 
            password: 'password'
        })
        .expect(500)
} );
