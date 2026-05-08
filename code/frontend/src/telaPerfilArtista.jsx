import { useNavigate } from "react-router-dom";
import "./sobreEvento.css";

import fotoShow from "./img/fotoShow.png";
import map from "./img/map.png";
import fotoPerfil from "./img/fotoPerfil.jpg";

export default function SobreEvento() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      {/* HEADER */}
      <header>
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
                Yuri Silva
              </span>

              <span className="user-role">Artista</span>
            </div>

            <div className="avatar">
              <img src={fotoPerfil} alt="Perfil" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container-principal">
        <div className="container-informacao">
          {/* ESQUERDA */}
          <div className="container-foto">
            <img src={fotoShow} alt="Evento" className="img-evento" />

            <div className="nome-evento">
              <h2>Nome do Evento</h2>

              <div className="nome">Sonara Festival 2026</div>
            </div>

            <div className="info-evento">
              <div className="campo">
                <span>Data</span>
                <div className="box">28/02/2026</div>
              </div>

              <div className="campo">
                <span>Início</span>
                <div className="box">19:30</div>
              </div>

              <div className="campo">
                <span>Fim</span>
                <div className="box">21:30</div>
              </div>
            </div>

            <button
              className="btn-inscricao"
              onClick={() => navigate("/inscricao")}
            >
              Inscreva-se
            </button>
          </div>

          {/* DIREITA */}
          <div className="container-sobre">
            {/* DESCRIÇÃO */}
            <div className="descricao-evento">
              <h2>Descrição do Evento</h2>

              <section className="descricao-box">
                <p>
                  Este evento reúne amantes de música ao vivo em uma experiência
                  única, com apresentações de artistas renomados, estrutura
                  moderna e ambiente envolvente.
                </p>
              </section>
            </div>

            {/* LOCALIZAÇÃO */}
            <div className="localizacao">
              <h2>Localização</h2>

              <div className="box-local">
                <p>
                  <strong>Rua:</strong> Loren Ipsum
                </p>

                <p>
                  <strong>Número:</strong> 78
                </p>

                <p>
                  <strong>Cidade:</strong> Loren Ipsum
                </p>

                <p>
                  <strong>Bairro:</strong> Loren Ipsum
                </p>

                <p>
                  <strong>UF:</strong> SP
                </p>
              </div>
            </div>

            {/* MAPA */}
            <div className="mapa-evento">
              <h2>Mapa do Evento</h2>

              <img src={map} alt="Mapa do evento" className="img-mapa" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
