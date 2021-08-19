import  { useReducer, useState }  from "react";
import UserRequest from "../../hooks/user-request";
import Router from 'next/router';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest , errors }  = UserRequest ({
        url: '/api/users/signup', 
        method: 'post',
        body : { 
            email, password
        }, 
        onSuccess: () => Router.push('/')
    });
 
    const onSubmit = async (event ) => { 
        event.preventDefault(); 
         
        await doRequest();  
    }
    return ( 
        <div className="w-50 mx-auto align-middle">
            <form onSubmit={onSubmit}>
                <h1>Sign Up</h1>
                <div className="form-group">
                    <label>Email address</label>
                    <input value={email} onChange={ e=> setEmail(e.target.value)} className="form-control"></input>
                </div>
                <div className="form-group">
                    <label>Passowrd</label>
                    <input type="password" value={password} onChange={e=> setPassword(e.target.value)} className="form-control"></input>
                </div>
                {errors}
                <button className="btn btn-primary">Sign Up</button>
            </form>
        </div>
        
    );
};

export default SignUp;