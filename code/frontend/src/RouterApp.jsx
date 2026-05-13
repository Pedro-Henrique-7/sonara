import { BrowserRouter, Routes, Route } from "react-router-dom";

// LOGON
import Cadastro from "./Logon/cadastro.jsx";
import Login from "./Logon/login.jsx";
import TelaEscolha from "./Logon/telaEscolha.jsx";
import TelaRecuperarSenha from "./Logon/recuperar_senha.jsx";

// ARTISTA
import Shows from "./Artista/telaShows.jsx";
import SobreEvento from "./Artista/sobreEvento.jsx";
import EventoInscricao from "./Artista/eventoInscricao.jsx";
import PlanosArtista from "./Artista/planosArtista.jsx";
import MeusEventos from "./Artista/telaMeusEventos.jsx";
import EventosLista from "./Artista/meusEventosLista.jsx";
import PerfilArtista from "./Artista/telaPerfilArtista.jsx";

// CASA DE SHOW
import TelaInicial from "./Casa_Show/telaInicial.jsx";

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<TelaEscolha />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar_senha" element={<TelaRecuperarSenha />} />

        {/* ARTISTA */}
        <Route path="/shows" element={<Shows />} />
        <Route path="/sobreEvento" element={<SobreEvento />} />
        <Route path="/eventoInscricao" element={<EventoInscricao />} />
        <Route path="/planosArtista" element={<PlanosArtista />} />
        <Route path="/meusEventos" element={<MeusEventos />} />
        <Route path="/listaEventos" element={<EventosLista />} />
        <Route path="/perfil-artista" element={<PerfilArtista />} />
      </Routes>
    </BrowserRouter>
  );
}
