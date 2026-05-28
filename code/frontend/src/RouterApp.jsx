import { BrowserRouter, Routes, Route } from "react-router-dom";

// LOGON
import Cadastro from "./Logon/cadastro.jsx";
import Login from "./Logon/login.jsx";
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
import MarcarEvento from "./Casa_Show/marcarEvento.jsx";
import ListaMeusEventos from "./Casa_Show/meus-eventos-casaShow.jsx";
import ContratarArtista from "./Casa_Show/contratarArtista.jsx";
import TelaSobreArtista from "./Casa_Show/sobreArtista.jsx";
import SobreEventoCasaShow from "./Casa_Show/sobreEventoCasaShow.jsx";
import TelaPerfilOrganizador from "./Casa_Show/telaPerfilOrganizador.jsx";


// EDITAR EVENTO
import EditarEvento from "./Casa_Show/sobreEventoCasaShow.jsx";

// USUÁRIO PADRÃO
import TelaUsuario from "./Usuario/telaUsuario.jsx";
import SobreEventoUsuario from "./Usuario/sobreEventoUsuario.jsx";
import MapaEvento from "./Usuario/telaMapa.jsx";

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar_senha" element={<TelaRecuperarSenha />} />

        {/* ARTISTA */}
        <Route path="/shows" element={<Shows />} />
        <Route path="/sobreEvento/:id" element={<SobreEvento />} />
        <Route path="/candidatar/:idEvento" element={<EventoInscricao />} />
        <Route path="/planosArtista" element={<PlanosArtista />} />
        <Route path="/meusEventos" element={<MeusEventos />} />
        <Route path="/listaEventos" element={<EventosLista />} />
        <Route path="/perfil-artista" element={<PerfilArtista />} />

        {/* CASA DE SHOW */}
        <Route path="/casaShow" element={<TelaInicial />} />
        <Route path="/marcarEvento" element={<MarcarEvento />} />
        <Route path="/listaMeusEventos" element={<ListaMeusEventos />} />
        <Route path="/contratarArtista" element={<ContratarArtista />} />
        <Route path="/sobreArtista" element={<TelaSobreArtista />} />
        <Route path="/perfil-organizador" element={<TelaPerfilOrganizador />} />
        <Route path="/sobreEventoCasaShow" element={<SobreEventoCasaShow />} />

        {/* INSCRITOS DO EVENTO */}
        <Route path="/evento/:idEvento/inscritos" element={<ContratarArtista />} />
        {/* EDITAR EVENTO */}
        <Route path="/editarEvento/:id" element={<EditarEvento />} />

        {/* USUÁRIO */}
        <Route path="/telaDeUsuario" element={<TelaUsuario />} />
        <Route
          path="/sobreEventoUsuario/:id"
          element={<SobreEventoUsuario />}
        />
        <Route path="/mapaDoEvento" element={<MapaEvento />} />
      </Routes>
    </BrowserRouter>
  );
}