import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./meusEventosLista.css";
import fotoPerfil from "./img/fotoPerfil.jpg";

// Mock — substitua por chamada à API
const eventosMock = [
  {
    id: 1,
    nome: "Noite da Loucura",
    data: "22/09/2026",
    hora: "23:00",
    descricao: "Noite para curtir de montão e dançar muito",
    imagem: null,
  },
  {
    id: 2,
    nome: "Noite da Loucura",
    data: "22/09/2026",
    hora: "23:00",
    descricao: "Noite de Evento de JAZZ com instrumentos clássicos do genero",
    imagem: null,
  },
  {
    id: 3,
    nome: "Noite da Loucura",
    data: "22/09/2026",
    hora: "23:00",
    descricao: "Noite para curtir com a familia",
    imagem: null,
  },
  {
    id: 4,
    nome: "Noite da Loucura",
    data: "22/09/2026",
    hora: "23:00",
    descricao: "Noite para se endoidar e curtir de montão e dançar muito",
    imagem: null,
  },
];

const usuario = sessionStorage.getItem("usuario");
const usuarioObj = usuario ? JSON.parse(usuario) : null;


export default function ListaEventos() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [eventos] = useState(eventosMock);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="lista-eventos-page">
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

      <main
        className={`lista-eventos-main ${
          visible ? "lista-eventos-main--visible" : ""
        }`}
      >
        <h2 className="lista-eventos-titulo">Meus Eventos</h2>

        <div className="lista-eventos-grid">
          {eventos.map((evento, index) => (
            <div
              key={evento.id}
              className="evento-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate("/meusEventos")}
            >
              {/* Imagem */}
              <div className="evento-card__img-wrapper">
                {evento.imagem ? (
                  <img
                    src={evento.imagem}
                    alt={evento.nome}
                    className="evento-card__img"
                  />
                ) : (
                  <div className="evento-card__img-placeholder" />
                )}
              </div>

              {/* Info */}
              <div className="evento-card__info">
                <span className="evento-card__nome">{evento.nome}</span>
                <span className="evento-card__datetime">
                  {evento.data}&nbsp;&nbsp;{evento.hora}
                </span>
                <p className="evento-card__descricao">{evento.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
