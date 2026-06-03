import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import fotoPerfil from "../img/fotoPerfil.jpg";
import "./headerUsuario.css";

export default function Header() {
  const navigate = useNavigate();
  const [usuarioObj, setUsuarioObj] = useState(null);

  function carregarUsuario() {
    const salvo = sessionStorage.getItem("usuario");

    if (salvo) {
      const usuario = JSON.parse(salvo);
      setUsuarioObj(usuario);
    }
  }

  useEffect(() => {
    carregarUsuario();

    window.addEventListener("usuarioAtualizado", carregarUsuario);

    return () => {
      window.removeEventListener("usuarioAtualizado", carregarUsuario);
    };
  }, []);

  // PEGA A FOTO NO MESMO PADRÃO DO ARTISTA
  const fotoUrl =
    usuarioObj?.foto ||
    usuarioObj?.foto_url ||
    usuarioObj?.usuario?.foto ||
    fotoPerfil;

  const tipoUsuario = usuarioObj?.tipo_usuario || "";

  // PEGA O NOME EM QUALQUER ESTRUTURA
  const nomeUsuario =
    usuarioObj?.nome_artistico ||
    usuarioObj?.usuario?.nome_artistico ||
    usuarioObj?.nome ||
    "Usuário";

  function rotaPerfil() {
    const tipo = tipoUsuario.toLowerCase();

    if (tipo === "artista") return "/perfil-artista";

    if (tipo === "organizador") return "/perfil-organizador";

    return "/perfil-usuario";
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
                {nomeUsuario}
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
