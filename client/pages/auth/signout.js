import Router from "next/dist/next-server/server/router";
import { useEffect } from "react";
import UserRequest from "../../hooks/user-request";

const SignOut =() => { 
    const { doRequest } = UserRequest({
        url: '/api/users/singout',
        method : 'post',
        body :{}, 
        onSuccess : () => Router.push ('/')
            
    })
    useEffect(() => {
        doRequest();
     } ,[]);
    
     return <div>Singing you out</div>;
};



export default SignOut;