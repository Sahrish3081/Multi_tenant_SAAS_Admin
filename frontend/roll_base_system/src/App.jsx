import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Index from "./pages/Index.jsx";
import Signup from "./pages/Signup.jsx";
import LoginCard from "./assets/components/LoginCard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginCard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;