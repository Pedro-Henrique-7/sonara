import { useNavigate } from "react-router-dom";
import fotoPerfil from "../img/fotoPerfil.jpg";
import "./header.css";

export default function Header() {
  const navigate = useNavigate();

  const usuario = sessionStorage.getItem("usuario");
  const usuarioObj = usuario ? JSON.parse(usuario) : null;

  return (
    <header className="header">
      <div className="content-limit">
        <div className="header-top">
          <nav className="nav">
            <span className="nav-item" onClick={() => navigate("/shows")}>
              Home
            </span>

            <span className="nav-item">Buscar</span>

            <span
              className="nav-item"
              onClick={() => navigate("/listaEventos")}
            >
              Meus Eventos
            </span>

            <span
              className="nav-item"
              onClick={() => navigate("/planosArtista")}
            >
              Plano
            </span>
          </nav>

          <div className="user">
            <div className="user-info">
              <span
                className="user-name"
                onClick={() => navigate("/perfil-artista")}
              >
                {usuarioObj?.nome || "Yuri Silva"}
              </span>

              <span className="user-role">Artista</span>
            </div>

            <div className="avatar" onClick={() => navigate("/perfil-artista")}>
              <img src={fotoPerfil} alt="Perfil" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
