import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Chatroom from "./components/Chatroom/Chatroom";
import './App.css';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path = "/" element = {<Login/>}/>
          <Route path = "/chatroom" element = {<Chatroom/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;