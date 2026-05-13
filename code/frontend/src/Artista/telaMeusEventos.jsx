import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./meusEventos.css";
import fotoPerfil from "../img/fotoPerfil.jpg";
import show2 from "../img/show2.webp";
// Dados mockados — substitua por chamada à API
const eventoMock = {
  imagem: show2, // coloque a URL ou import da imagem do evento
  nomeEvento: "Rock in Rio 2026",
  descricao:
    "O maior festival de música do mundo retorna com line-up incrível, reunindo os maiores artistas nacionais e internacionais em noites inesquecíveis.",
  data: "15/07/2026",
  hora: "20:00",
  cacheEsperado: "R$ 15.000,00",
  cacheOfertado: "R$ 12.500,00",
  status: "REALISADO",
};

export default function MeusEventos() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [evento] = useState(eventoMock);
  const usuario = sessionStorage.getItem("usuario");
  const usuarioObj = usuario ? JSON.parse(usuario) : null;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="meus-eventos-page">
      {/* ← Fragment resolvendo o erro de múltipla raiz */}
      <header>
        <div className="content-limit">
          <div className="header-top">
            <nav className="nav">
              <span className="nav-item">Home</span>
              <span className="nav-item">Buscar</span>
              <span
                className="nav-item"
                onClick={() => navigate("/meusEventos")}
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
                <span className="user-name">{usuarioObj?.nome}</span>
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
        className={`meus-eventos-main ${
          visible ? "meus-eventos-main--visible" : ""
        }`}
      >
        {/* Linha superior: imagem + detalhes do evento */}
        <div className="meus-eventos-top">
          {/* Imagem do evento */}
          <div className="evento-imagem-wrapper">
            {evento.imagem ? (
              <img src={evento.imagem} alt="Evento" className="evento-imagem" />
            ) : (
              <div className="evento-imagem evento-imagem--placeholder" />
            )}
          </div>
          {/* Card detalhes */}
          <div className="evento-detalhes-card">
            <div className="evento-detalhes-campo">
              <label className="evento-detalhes-label">Nome do evento</label>
              <div className="evento-detalhes-input">{evento.nomeEvento}</div>
            </div>

            <div className="evento-detalhes-campo">
              <label className="evento-detalhes-label">Descrição:</label>
              <div className="evento-detalhes-textarea">{evento.descricao}</div>
            </div>

            <div className="evento-detalhes-row">
              <div className="evento-detalhes-campo">
                <label className="evento-detalhes-label">DATA</label>
                <div className="evento-detalhes-input evento-detalhes-input--small">
                  {evento.data || "DD/MM/AAAA"}
                </div>
              </div>
              <div className="evento-detalhes-campo-hora">
                <label className="evento-detalhes-label">HORA</label>
                <div className="evento-detalhes-input evento-detalhes-input--small">
                  {evento.hora || "00:00"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card inferior: cache e status */}
        <div className="evento-cache-card">
          <div className="evento-cache-campo">
            <label className="evento-cache-label">Cache Esperado</label>
            <div className="evento-cache-input">{evento.cacheEsperado}</div>
          </div>

          <div className="evento-cache-campo">
            <label className="evento-cache-label">Cache Ofertado</label>
            <div className="evento-cache-input">{evento.cacheOfertado}</div>
          </div>

          <div className="evento-cache-campo">
            <label className="evento-cache-label">Status</label>
            <div className="evento-cache-input">{evento.status}</div>
          </div>

          <div className="evento-cache-actions">
            <button
              className="evento-btn-ver"
              onClick={() => navigate("/meus-eventos")}
            >
              Ver meus Eventos
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
