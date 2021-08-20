import Moment from 'react-moment';
import moment from 'moment';


const OrderIndex = ({orders}) => { 
    return  <ul>
        { orders.map(order => { 
            return  <li key={order.id}>{order.ticket.title} - {order.status} : {order.created}  
                            <Moment format="YYYY/MM/DD HH:mm">
                                {order.createdTime}
                            </Moment>
                </li>
        })}
    </ul>
}

OrderIndex.getInitialProps = async (context , client ) => { 
     
    const { data } = await client.get( `/api/orders`);

    return { orders: data };
}
export default OrderIndex;