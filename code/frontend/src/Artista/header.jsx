import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import fotoPerfil from "../img/fotoPerfil.jpg";
import "./header.css";

export default function HeaderArtista() {
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
    if (tipo === "") return "/";

    return "/perfil";
  }

  return (
    <header className="artist-header">
      <div className="artist-container">
        <nav className="artist-nav">
          <span className="artist-nav-item" onClick={() => navigate("/shows")}>
            Home
          </span>

          <span className="artist-nav-item">Buscar</span>

          <span
            className="artist-nav-item"
            onClick={() => navigate("/minhasCandidaturas")}
          >
            Meus Eventos
          </span>
        </nav>

        <div className="artist-user">
          <div className="artist-user-info">
            <span
              className="artist-user-name"
              onClick={() => navigate(rotaPerfil())}
            >
              {usuarioObj?.artista?.nome_artistico || "Usuário"}
            </span>

            <span className="artist-user-role">{tipoUsuario}</span>
          </div>

          <div className="artist-avatar" onClick={() => navigate(rotaPerfil())}>
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
