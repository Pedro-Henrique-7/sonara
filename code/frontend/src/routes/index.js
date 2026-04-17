import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login";
import Home from "./home";
import OutraPagina from "./OutraPagina";

function Rota() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/outra" element={<OutraPagina />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rota;