import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./telaEscolha";
import Cadastro from "./cadastro";
import Login from "./login";
import TelaRecuperarSenha from "./recuperar_senha";

function Shows() {
  return <h1>Tela Home (em construção)</h1>;
}

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/recuperar_senha" element={<TelaRecuperarSenha />} />
      </Routes>
    </BrowserRouter>
  );
}
