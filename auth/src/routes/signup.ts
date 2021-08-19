import expres , {Request, Response} from 'express';
import {body } from 'express-validator';
import { BadRequestError , validationRequest } from '@goodmanzticket/common';
//import { RequestValidationError } from '../errors/requestValidationError';
import jwt from 'jsonwebtoken'

import { User} from '../models/user';

const router = expres();


router.post('/api/users/signup' , [
    body('email')
        .isEmail()
        .withMessage('Email must be validd'),
    body('password')
        .trim()
        .isLength({min: 4, max:20})
        .withMessage('Pwd must be more than 4 and less than 20')
    ] ,
    validationRequest, 
    async  (req :Request,res: Response) => {
      
        const {email, password } = req.body; 
        const existingUser = await User.findOne({email});; 
        if (existingUser)  {
             throw new BadRequestError('Email in use');  
        }
        const user = User.build({ email, password});
        console.log(req.body);
        await user.save();
        //Generate JWT  
        
        const userJwt = jwt.sign({
            id: user.id, 
            email: user.email
            }, 
            process.env.JWT_KEY!
        );

        req.session  = {
            jwt: userJwt
        };
        //Save on session 

        res.status(201).send(user);
});

export {router as signupRouter};
