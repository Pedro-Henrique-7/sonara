import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./img/sonara-logo.svg";
import diamante from "./img/diamante.png";
import platina from "./img/platina.png";
import fotoPerfil from "./img/fotoPerfil.jpg";
import "./planosArtista.css";

const planos = [
  {
    id: "platina",
    nome: "Plano Platina",
    icone: platina,
    descricao:
      "Acesse recursos exclusivos para artistas em crescimento. Divulgue seus eventos para um público maior, receba suporte prioritário e tenha destaque nas buscas da plataforma. Ideal para quem está começando a construir sua presença no cenário musical.",
  },
  {
    id: "diamante",
    nome: "Plano Diamante",
    icone: diamante,
    descricao:
      "O plano definitivo para artistas estabelecidos. Tenha acesso ilimitado a todas as ferramentas da plataforma, analytics avançados, posicionamento premium nas buscas e suporte dedicado 24/7. Maximize sua visibilidade e alcance novos patamares na sua carreira.",
  },
];

export default function PlanosArtista() {

  const usuario = sessionStorage.getItem("usuario");
  const usuarioObj = usuario ? JSON.parse(usuario) : null;
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <header>
        <div className="content-limit">
          {" "}
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
                  {usuarioObj?.nome}
                </span>
                <span className="user-role">Artista</span>
              </div>
              <div className="avatar">
                <img src={fotoPerfil} alt="Perfil" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className={`planos-main ${visible ? "planos-main--visible" : ""}`}>
        <h2 className="planos-titulo">Escolha seu Plano</h2>

        <div className="planos-lista">
          {planos.map((plano, index) => (
            <div
              key={plano.id}
              className="plano-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="plano-card__header">
                <h3 className="plano-card__nome">{plano.nome}</h3>
                <div className="plano-card__icone">
                  <img
                    src={plano.icone}
                    alt={plano.nome}
                    className="plano-card__icone-img"
                  />
                </div>
              </div>

              <div className="plano-card__body">
                <p className="plano-card__descricao">"{plano.descricao}"</p>
              </div>

              <button className="plano-card__btn">Assinar agora</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
