import mongoose from 'mongoose';
import {  updateIfCurrentPlugin  } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are requried to create a new User
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that a User Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties
// that a User Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number; 
  orderId?: string;  //? is optional 
  createdTime?: string;   
}

// const userSchema = new mongoose.Schema<UserDoc>({})
const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: { 
    type: String, 

  },
  createdTime : { 
    type: String,
  }


}, { 
  toJSON: { 
    transform(doc, ret){
      ret.id = ret._id; 
      ret.createdTime = ret._id.getTimestamp();
      delete ret._id;
    }
  }
}
);

// ticketSchema.pre('save' , async function (done) { 
//    if ( this.isModified('password')) {
     
//    }
//    done(); 
// }); 
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin); 


ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema );

 
export { Ticket };

