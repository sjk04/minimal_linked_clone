import axios from "axios";
import { Routes, Route, BrowserRouter,Link,Outlet } from "react-router";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
