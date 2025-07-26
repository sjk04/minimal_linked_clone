//import {Routes,Route,BrowserRouter} from "react-router"
import { useState } from "react";
import axios from "axios";
import "./Signin.css";
function Signin() {
  const [message, setMessage] = useState("");
  function signin() {
    axios
      .post("http://localhost:4000/signin", {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      })
      .then(function (res) {
        const token = res.data.token;
        if (token) {
          localStorage.setItem("token", token);
          window.location = "/dashboard";
        }
        else{
            setMessage(res.data.message)
        }
      });
  }
  return (
      <div className="signin-container">
      <div className="signin-card">
      <input id="email" type="text" placeholder="@gmail.com" />
      <input id="password" type="text" placeholder="password" />
      <button onClick={signin}>Sign in</button>
      <p className="message">{message}</p>
    </div>
    </div>
  );
}
export default Signin;
