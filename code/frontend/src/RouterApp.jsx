import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./telaEscolha";
import Cadastro from "./cadastro";
import Login from "./login";
import Shows from "./telaShows";
import TelaRecuperarSenha from "./recuperar_senha";
import SobreEvento from "./sobreEvento.jsx";
import EventoInscricao from "./eventoInscricao.jsx";
import PlanosArtista from "./planosArtista.jsx";

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/recuperar_senha" element={<TelaRecuperarSenha />} />
        <Route path="/sobreEvento" element={<SobreEvento />} />
        <Route path="/eventoInscricao" element={<EventoInscricao />} />
        <Route path="/planosArtista" element={<PlanosArtista />} />
      </Routes>
    </BrowserRouter>
  );
}
