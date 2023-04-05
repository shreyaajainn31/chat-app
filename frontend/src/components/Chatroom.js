import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function Chatroom(){
    const location = useLocation();
    const user = location.state.user;
    const [message, setMessage] = useState('');
    
    const [messageArray, setMessageArray] = useState([]);


    const handleOnClick = e => {
        e.preventDefault();
        const newMessage = {
            user: user,
            message:message,
        };
        setMessageArray([...messageArray,newMessage]);
        setMessage('');
    }

    return (
        <div>
             <p> Welcome {user}</p>
             {
            <div className="chatting">
                {messageArray.map((mess, index)=>(
                    <p>{mess.user}: {mess.message}</p>
                ))}
            </div>
        }
        <div className="chatroom">
        </div>
       
        <div className="message">
        <input type="text" placeholder="enter message" value={message} onChange = {e=>setMessage(e.target.value)}/>
        <button onClick={handleOnClick}>Enter</button>
        </div>
        </div>
    );
}

export default Chatroom;