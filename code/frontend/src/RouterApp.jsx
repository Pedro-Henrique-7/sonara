import { BrowserRouter, Routes, Route } from "react-router-dom";

// LOGON
import Cadastro from "./logon/cadastro.jsx";
import Login from "./logon/login.jsx";
import TelaEscolha from "./logon/telaEscolha.jsx";
import TelaRecuperarSenha from "./logon/recuperar_senha.jsx";

// ARTISTA
import Shows from "./artista/telaShows.jsx";
import SobreEvento from "./artista/sobreEvento.jsx";
import EventoInscricao from "./artista/eventoInscricao.jsx";
import PlanosArtista from "./artista/planosArtista.jsx";
import MeusEventos from "./artista/telaMeusEventos.jsx";
import EventosLista from "./artista/meusEventosLista.jsx";
import PerfilArtista from "./artista/telaPerfilArtista.jsx";

// CASA DE SHOW
import TelaInicial from "./casa_show/telaInicial.jsx";

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

        {/* Casa de Show */}

        <Route path="/casaShow" element={<TelaInicial/>} />
      </Routes>
    </BrowserRouter>
  );
}
