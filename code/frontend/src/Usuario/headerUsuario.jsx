import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import fotoPerfil from "../img/fotoPerfil.jpg";
import "./headerUsuario.css";

export default function Header() {
  const navigate = useNavigate();
  const [usuarioObj, setUsuarioObj] = useState(null);

  function carregarUsuario() {
    const salvo = sessionStorage.getItem("usuario");
    setUsuarioObj(salvo ? JSON.parse(salvo) : null);
  }

  useEffect(() => {
    carregarUsuario();
    // Atualiza o header quando PerfilArtista salvar os dados
    window.addEventListener("usuarioAtualizado", carregarUsuario);
    return () =>
      window.removeEventListener("usuarioAtualizado", carregarUsuario);
  }, []);

  const fotoUrl = usuarioObj?.foto_url || fotoPerfil;
  const tipoUsuario = usuarioObj?.tipo_usuario || "";

  function rotaPerfil() {
    const tipo = tipoUsuario.toLowerCase();
    if (tipo === "artista") return "/perfil-artista";
    if (tipo === "organizador") return "/perfil-organizador";
    return "/perfil";
  }

  return (
    <header className="header">
      <div className="content-limit">
        <div className="header-top">
          <nav className="nav">
            <span
              className="nav-item"
              onClick={() => navigate("/telaDeUsuario")}
            >
              Home
            </span>

            <span className="nav-item">Buscar</span>

            <span
              className="nav-item"
              onClick={() => navigate("/mapaDoEvento")}
            >
              Mapa
            </span>
          </nav>

          <div className="user">
            <div className="user-info">
              <span
                className="user-name"
                onClick={() => navigate(rotaPerfil())}
              >
                {usuarioObj?.nome_artistico || "Usuário"}
              </span>
              <span className="user-role">{tipoUsuario}</span>
            </div>

            <div className="avatar" onClick={() => navigate(rotaPerfil())}>
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
      </div>
    </header>
  );
}
