import  { useEffect , useState}  from 'react'
import  StripeCheckOut from 'react-stripe-checkout'
import useRequest from '../../hooks/user-request'
import Router from 'next/router'

const OrderShow =({order,currentUser }) => { 
    const [timeleft, setTimeleft] = useState(0);

    const { doRequest , errors} = useRequest({
        url: '/api/payments', 
        method: 'post',
        body: { 
           orderId : order.id     
        }, 
        onSuccess: (payment) =>  Router.push('/orders')
    })


    useEffect(() => { 
        const findTimeLeft = () => { 
            const msLeft = new Date(order.expireAt) - new Date();         
            setTimeleft(Math.round(msLeft /1000)) 
        }
        findTimeLeft();
        const timeId = setInterval(findTimeLeft, 1000);

        return () => { 
            clearInterval(timeId);
        }
    }, [order])
    
    if ( timeleft < 0 ){
        return <div>Order expired</div>
    }

    return ( 
        <>
            <div> Time left to pay : {timeleft} sec
                <StripeCheckOut 
                    token={({id}) =>  doRequest({token: id}) }
                    stripeKey="pk_test_51JPks0DQ1wMWNvhEaPbSaT38iz2wz2zkCDESv5rrwcr8kUhItSC1ly2QaCRX6MwZ2MweTJurlzK9Jh3CmflVeXp800sXjH32CZ"
                    amount={order.ticket.price * 100}
                    email={currentUser.email}
                /> 
                {errors}
            </div>
            
        </>
    )

}


OrderShow.getInitialProps = async (context , client ) => { 
    const { orderId } = context.query; 
    const { data } = await client.get( `/api/orders/${orderId}`);

    return { order: data };
}
export default OrderShow;