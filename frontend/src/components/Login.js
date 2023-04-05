import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatroom from "./Chatroom";
import "./Login.css";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };


  const handleButton = (e) => {
    e.preventDefault();
    console.log(password);
    if (password.trim() === "") {
      setPasswordError("Password cannot be empty");
      return;
    }

    const webSocket = new WebSocket("ws://localhost:3002/ws");
    webSocket.onopen = () => {
      webSocket.send(JSON.stringify({ password }));
    };

    webSocket.onmessage = (e) => {
      const response = JSON.parse(e.data);
      console.log(response);
      if (!response.success) {
        setPasswordError("Invalid password");
      } else {
        navigate("/chatroom",  { state: { user } });
      }
    };

    webSocket.onclose = () => {
      webSocket.close();
    };
  };

  return (
    <div className="login">
      <br />
      <br />
      <label htmlFor="user"> Enter User Name</label>
      <input placeholder="username" type="text" value={user} onChange={e=> setUser(e.target.value)}/>
      <br/>
      <br/>
      <label htmlFor="code">Enter Verification Code</label>
      <input
        placeholder="Room password"
        value={password}
        onChange={handlePassword}
        type = "password"
      />
      <div className="error">{passwordError}</div>
      <br />
      <br />
      <button onClick={handleButton}>Join Room</button>
      

    </div>
  );
}

export default Login;
