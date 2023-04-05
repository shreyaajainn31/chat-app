import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const [password, setRoomPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const handlePassword = e => {
    setRoomPassword(e.target.value);
  }

  const handleButton = e => {
    e.preventDefault();
    if (password.length === 0) {
        setPasswordError('Password is required')
    } else {
        const webSocket = new WebSocket('ws://localhost:8080/ws');
        webSocket.onopen = () => {
        webSocket.send(JSON.stringify({ password }));
        };
  
        webSocket.onmessage = (e) => {
        const pass = JSON.parse(e.data);
        if (pass.success) {
            navigate("/chatroom");
        } else {
            setPasswordError('Invalid password');
        }
        webSocket.close();
        }
  
        console.log(passwordError); // Log passwordError value here
    }
  }
  

  return (
    <div className="login">
      <br />
      <label htmlFor="code"> Enter Verification Code </label>
      <br />
      <br />
      <input type="text" placeholder="Room password" value={password} onChange={handlePassword} />
      <div className="error">
        {passwordError.length > 0 ? passwordError : ''}
      </div>
      <br />
      <br />
      <button onClick={handleButton}> Join Room </button>
    </div>
  );
}

export default Login;
