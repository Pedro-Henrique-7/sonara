import { useNavigate } from "react-router-dom";
import logo from "./img/sonara-logo.svg";
import "./sobreEvento.css";
import { Search } from "lucide-react";
import fotoShow from "./img/fotoShow.png";
import map from "./img/map.png";

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
              <span className="nav-item">Meus Eventos</span>
              <span className="nav-item">Plano</span>
            </nav>

            <div className="user">
              <div className="user-info">
                <span className="user-name">Yuri Silva</span>
                <span className="user-role">Artista</span>
              </div>

              <div className="avatar">
                {/* <img src={fotoPerfil} alt="Perfil" /> */}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-principal">
        <div className="container-informacao">
          <div className="container-foto">
            <img src={fotoShow} alt="evento" />
            <div className="nome-evento">
              <p>Nome: </p>
              <section className="nome">
                <p>Sonara Festival 2024</p>
              </section>
            </div>

            <div className="linha-info">
              <div className="info-evento">
                <div className="campo">
                  <span>Data:</span>
                  <div className="box">28/02/2026</div>
                </div>

                <div className="campo">
                  <span>Início:</span>
                  <div className="box">19:30</div>
                </div>

                <div className="campo">
                  <span>Fim:</span>
                  <div className="box">21:30</div>
                </div>
              </div>
            </div>

            <button onClick={() => navigate("/inscricao")}>Inscreva-se</button>
          </div>

          <div className="container-sobre">
            <div className="descricao-evento">
              <label htmlFor="descricao">Descrição do Evento</label>
              <section class="descricao-evento">
                <p>
                  Este evento reúne amantes de música ao vivo em uma experiência
                  única, com apresentações de artistas renomados, estrutura
                  moderna e ambiente envolvente.
                </p>
              </section>
            </div>

            <div className="localizacao">
              <span>Localização:</span>
              <div className="box-local">
                <p>Rua: Loren Ipsum</p>
                <p>Número: 78</p>
                <p>Cidade: Loren Ipsum</p>
                <p>Bairro: Loren Ipsum</p>
                <p>UF: SP</p>
              </div>
            </div>

            <div className="mapa-evento">
              <label htmlFor="mapa">Mapa do Evento</label>
              <img src={map} alt="evento" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
