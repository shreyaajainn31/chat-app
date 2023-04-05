import React from "react";
import { useLocation } from "react-router-dom";

function Chatroom(){
    const location = useLocation();
    const user = location.state.user;
    return (
        <div>
        <div className="chatroom">
        </div>
        <p> Welcome {user}</p>
        <div className="message">
        <input type="text" placeholder="enter message" />
        <button>Enter</button>
        </div>
        </div>
    );
}

export default Chatroom;