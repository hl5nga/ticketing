import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@goodmanzticket/common';
import { Ticket, TicketDoc } from './ticket';
// An interface that describes the properties
// that are requried to create a new User
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expireAt: Date; 
  ticket:TicketDoc; 

}

// An interface that describes the properties
// that a User Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describes the properties
// that a User Document has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expireAt: Date; 
  ticket:TicketDoc; 
  version: number;
  createdTime?: string;   
}

// const userSchema = new mongoose.Schema<UserDoc>({})
const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum : Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expireAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: { 
    type: mongoose.Schema.Types.ObjectId, 
      ref: 'Ticket'
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

// OrderSchema.pre('save' , async function (done) { 
//    if ( this.isModified('password')) {
     
//    }
//    done(); 
// }); 
OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

 
OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema  );

 
export { Order ,OrderStatus  };

