import mongoose from 'mongoose';
import { Order ,OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are requried to create a new User
interface TicketAttrs {
  id: string; 
  title: string;
  price: number;

  
}

// An interface that describes the properties
// that a User Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {id:string, version:number }) : Promise <TicketDoc | null >;
}

// An interface that describes the properties
// that a User Document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved() : Promise<boolean>;
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
  

}, { 
  toJSON: { 
    transform(doc, ret){
      ret.id = ret._id; 
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

ticketSchema.set('versionKey' , 'version');
ticketSchema.plugin(updateIfCurrentPlugin); 

ticketSchema.statics.findByEvent = (event: {id:string, version:number }) => { 
  return Ticket.findOne({
    _id: event.id, 
    version: event.version -1 
  })
}
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, 
    title: attrs.title, 
    price: attrs.price 
  });
};

ticketSchema.methods.isReserved = async function()  {
  const existingOrder = await Order.findOne( { 
      ticket: this as any, 
      status: { 
          $in: [
              OrderStatus.Created, 
              OrderStatus.AwaitingPayment, 
              OrderStatus.Complete
          ]
      }
  });  
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema );

 
export { Ticket };

