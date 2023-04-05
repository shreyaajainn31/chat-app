import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import './Login.css';

function Login(){
    const [password, setRoomPassword] = useState('');
    let navigate = useNavigate();

    const handlePassword = e => {
        setRoomPassword(e.target.value);
    }

    const handleButton = e => {
        e.preventDefault();
        navigate("/chatroom");
    }

    return(
        <div className = "login">
            <br/>
            <lable for = "code"> Verification Code </lable>
            <br/>
            <br/>
            <input type="text" placeholder="Room password" value = {password} onChange={handlePassword}/>
            <br/>
            <br/>
            <button onClick={handleButton}> Join Room </button>
        </div>
    );
}

export default Login;
