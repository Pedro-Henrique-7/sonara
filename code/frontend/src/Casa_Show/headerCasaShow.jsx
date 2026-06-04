import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import fotoPerfil from "../img/fotoPerfil.jpg";
import "./headerCasaShow.css";

export default function HeaderCasaShow() {
  const navigate = useNavigate();
  const [usuarioObj, setUsuarioObj] = useState(null);

  function carregarUsuario() {
    const salvo = sessionStorage.getItem("usuario");
    setUsuarioObj(salvo ? JSON.parse(salvo) : null);
  }

  useEffect(() => {
    carregarUsuario();

    window.addEventListener("usuarioAtualizado", carregarUsuario);

    return () => {
      window.removeEventListener("usuarioAtualizado", carregarUsuario);
    };
  }, []);

  const fotoUrl = usuarioObj?.foto || fotoPerfil;
  const tipoUsuario = usuarioObj?.tipo_usuario || "";

  function rotaPerfil() {
    const tipo = tipoUsuario.toLowerCase();

    if (tipo === "artista") return "/perfil-artista";
    if (tipo === "organizador") return "/perfil-organizador";

    return "/perfil";
  }

  return (
    <header className="cs-header">
      <div className="cs-container">
        <nav className="cs-nav">
          <span className="cs-nav-item" onClick={() => navigate("/casaShow")}>
            Home
          </span>

          <span className="cs-nav-item">Buscar</span>

          <span
            className="cs-nav-item"
            onClick={() => navigate("/listaMeusEventos")}
          >
            Meus Eventos
          </span>
        </nav>

        <div className="cs-user-area">
          <div className="cs-user-info">
            <span
              className="cs-user-name"
              onClick={() => navigate(rotaPerfil())}
            >
              {usuarioObj?.nome || "Usuário"}
            </span>

            <span className="cs-user-role">{tipoUsuario}</span>
          </div>

          <div className="cs-avatar" onClick={() => navigate(rotaPerfil())}>
            <img
              src={fotoUrl}
              alt="Perfil"
              onError={(e) => {
                e.target.src = fotoPerfil;
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
