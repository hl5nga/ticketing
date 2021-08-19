import expres from 'express';
const router = expres.Router();

import { currentUser } from '@goodmanzticket/common';
import { requireAuth } from '@goodmanzticket/common';

router.get('/api/users/currentuser' , currentUser ,requireAuth ,  (req,res) => {
    res.send ({ currentUser : req.currentUser || null });
    //res.send({}) ;
});

export {router as currentUserRouter};
