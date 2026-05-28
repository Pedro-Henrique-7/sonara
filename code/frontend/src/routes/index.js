import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Logon/login.jsx";
import Home from "./home";
import OutraPagina from "./OutraPagina";

function Rota() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/outra" element={<OutraPagina />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rota;
