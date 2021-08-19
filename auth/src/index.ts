import mongoose from 'mongoose';
import {app} from './app';
// app.get('/' , (req,res) => {
//   res.send('This is main');
// });
// app.all('*' ,  async  (req, res ) => {
//    throw new NotFoundError()   ; 
// });

const startUpDB = async() => { 
  if (!process.env.JWT_KEY ){
    throw new Error('JWT_KEY is not defined');
  }
  if (!process.env.MONGO_URI ){
    throw new Error('MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI  , { 
      useNewUrlParser:true, 
      useUnifiedTopology: true, 
      useCreateIndex: true  
    }); 
    console.log('Connected mongo DB in Auth');
  }
  catch(err) {
    console.error ( err )
  }
  app.listen(3000, () => {
    
    console.log('Listening on port 3000!!!!!!!!');
  });
}


startUpDB(); 

