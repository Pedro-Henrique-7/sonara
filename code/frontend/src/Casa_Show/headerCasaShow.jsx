import { useNavigate } from "react-router-dom";
import "./headerCasaShow.css";

export default function HeaderCasaShow() {
  const usuario = sessionStorage.getItem("usuario");
  const usuarioObj = usuario ? JSON.parse(usuario) : null;
  const navigate = useNavigate();
  return (
    <header className="header-show">
      <nav className="nav">
        <button className="nav-btn" onClick={() => navigate("/casaShow")}>
          Home
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/contratarArtista")}
        >
          Buscar
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/listaMeusEventos")}
        >
          Meus Eventos
        </button>
      </nav>

      <div className="perfil-area">
        <div className="perfil-info">
          <h2>{usuarioObj?.nome || "Usuário"}</h2>
          <span>Organizador de Eventos</span>
        </div>
      </div>
    </header>
  );
}
