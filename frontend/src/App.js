import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Chatroom from "./components/Chatroom";
import Login from "./components/Login";

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