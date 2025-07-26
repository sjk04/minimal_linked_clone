import { useState } from "react";
import axios from "axios";
import "./Signup.css";
function Signup() {
  const [message, setMessage] = useState("");
  function signup() {
    axios
      .post("http://localhost:4000/signup", {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        name: document.getElementById("name").value,
      })
      .then(function (res) {
        setMessage(res.data.message);
        if (res.data.message === "User successfully signed up") {
          window.location = "/signin";
        }
      });
  }
  return (
    <div className="signup-container">
      <div className="signup-card">
        
        <input id="email" type="text" placeholder="@gmail.com" />
        <input id="password" type="text" placeholder="password" />
        <input id="name" type="text" placeholder="name" />
        <button onClick={signup}>Sign up</button>
        <p className="message">{message}</p>
      </div>
    </div>
  );
}
export default Signup;
