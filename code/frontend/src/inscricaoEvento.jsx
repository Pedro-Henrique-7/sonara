import { useNavigate } from "react-router-dom";
import "./incricaoEvento.css";
import fotoShow from "./img/fotoShow.png";
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"></link>;

export default function SobreEvento() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      <header>
        <div className="content-limit">
          <div className="header-top">
            <nav className="nav">
              <span className="nav-item" onClick={() => navigate("/shows")}>
                Home
              </span>
              <span className="nav-item">Buscar</span>
              <span
                className="nav-item"
                onClick={() => navigate("/sobreEvento")}
              >
                Meus Eventos
              </span>
              <span className="nav-item">Plano</span>
            </nav>

            <div className="user">
              <div className="user-info">
                <span className="user-name">Yuri Silva</span>
                <span className="user-role">Artista</span>
              </div>
              <div className="avatar"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-principal">
        {/* Seção Superior: Imagem e Formulário de Inscrição */}
        <div className="container-foto">
          <div className="container-img">
            <img src={fotoShow} alt="Evento" />
          </div>
        </div>

        <div className="top-section">
          <div className="form-inscricao-container">
            <div className="nome">
              <p>Nome: </p>
              <section className="nome">
                <p>Sonara Festival 2024</p>
              </section>
            </div>

            <div className="descricao-evento">
              <label htmlFor="descricao">Descrição do Evento</label>
              <section class="descricao-evento">
                <p>
                  Este evento reúne amantes de música ao vivo em uma experiência
                </p>
              </section>
            </div>

            <div className="linha-info">
              <div className="info-evento">
                <div className="campo-data">
                  <span>Data:</span>
                  <div className="box">28/02/2026</div>
                </div>

                <div className="campo-inicio">
                  <span>Início:</span>
                  <div className="box">19:30</div>
                </div>
              </div>
            </div>

            <button
              className="btn-inscrever"
              onClick={() => navigate("/inscricao")}
            >
              Inscreva-se
            </button>
          </div>
        </div>

        {/* Seção Inferior: Detalhes de Cache e Status */}
        <div className="bottom-section">
          <div className="info-cache-container">
            <div className="cache-esperado">
              <p>Cache Esperado: </p>
              <section className="nome">
                <p>R$200</p>
              </section>
            </div>

            <div className="cache-esperado">
              <p>Cache Ofertado: </p>
              <section className="nome">
                <p>R$250</p>
              </section>
            </div>

            <div data-aos="zoom-in-up">
              <button
                className="btn-ver-eventos"
                onClick={() => navigate("/meus-eventos")}
              >
                Ver meus Eventos
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
