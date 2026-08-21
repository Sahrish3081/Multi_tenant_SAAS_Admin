import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Index from "./pages/Index.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import  ProtectedRoute  from "./assets/components/ProtectedRoute.jsx"
import Dashboard from "./pages/Dashboard.jsx";
 import VerifyEmail from "./pages/VerifyEmail.jsx";
 import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import CreateWorkspace from "./pages/workspace.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard/></ProtectedRoute> }/>
         <Route path="/verify-email" element={<VerifyEmail />} />
         <Route path="/reset-password" element={<ResetPassword />} />
         <Route path="/profile" element={<Profile/>}/>
         <Route path="/create-workspace" element={<CreateWorkspace/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;