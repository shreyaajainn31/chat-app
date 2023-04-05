import React from "react";
import './Login.css';
function Login(){
    return(
        <div className = "login">
            <br/>
            <lable for = "code"> Verification Code </lable>
            <br/>
            <br/>
            <input type="text" placeholder="Room password"/>
            <br/>
            <br/>
            <button> Join Room </button>
        </div>
    );
}

export default Login;
