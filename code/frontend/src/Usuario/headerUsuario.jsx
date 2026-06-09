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
    <header className="header-usuario">
      <div className="content-limit-usuario">
        <div className="header-top-usuario">
          <nav className="header-nav-usuario">
            <span
              className="header-nav-item-usuario"
              onClick={() => navigate("/telaDeUsuario")}
            >
              Home
            </span>

            <span
              className="header-nav-item-usuario"
              onClick={() => navigate("/telaDeUsuario")}
            ></span>

            <span
              className="header-nav-item-usuario"
              onClick={() => navigate("/mapaDoEvento")}
            >
              Mapa
            </span>
          </nav>

          <div className="header-user-usuario">
            <div className="header-user-info-usuario">
              <span
                className="header-user-name-usuario"
                onClick={() => navigate(rotaPerfil())}
              >
                {nomeUsuario}
              </span>

              <span className="header-avatar-usuario-user-role">
                {tipoUsuario}
              </span>
            </div>

            <div
              className="header-avatar-usuario"
              onClick={() => navigate(rotaPerfil())}
            >
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
