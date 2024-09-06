import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./elements/Login";
import Home from "./elements/Home";
import Register from "./elements/Register";
import Notecards from "./elements/Notecards";
import NotFound from "./elements/NotFound"; // Import the NotFound component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/:userid" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notecards/:notebook_id" element={<Notecards />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
