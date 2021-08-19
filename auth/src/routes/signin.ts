import expres, {Request, Response} from 'express';
import {body  } from 'express-validator';
import { User } from '../models/user';
//import { RequestValidationError } from '../errors/requestValidationError';
import jwt from 'jsonwebtoken'

import { Password } from '../services/password';
import { validationRequest , BadRequestError } from '@goodmanzticket/common';

const router = expres();

router.post('/api/users/signin' , 
    [
        body('email')
            .isEmail()
            .withMessage('Email is invalid'), 
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must provide a password')
    ],    validationRequest, 
    async (req : Request,res: Response) => {
        const {email , password }     = req.body ; 

        const existingUser = await User.findOne({ email }); 
        if (!existingUser){
            throw new BadRequestError('Invalid credential');
        }

        const passwordMatch = await Password.compare(
            existingUser.password, 
            password 
        )
        
        if ( !passwordMatch ) { 
            throw  new BadRequestError('Invalid password provided')
        }
        const userJwt = jwt.sign({
            id: existingUser.id, 
            email: existingUser.email
            }, 
            process.env.JWT_KEY!
        );

        req.session  = {
            jwt: userJwt
        };
        //Save on session 

        res.status(200).send(existingUser);

    }
);

export {router as signinRouter};
