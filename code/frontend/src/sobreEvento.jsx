import { useNavigate } from "react-router-dom";
import logo from "./img/sonara-logo.svg";
import "./sobreEvento.css";
import { Search } from "lucide-react";
import show3 from "./img/show3.png";

export default function SobreEvento() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      <header>
        <div className="content-limit">
          <div className="header-top">
            <nav className="nav">
              <span className="nav-item" onClick={() => navigate("/")}>
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

      <main>
        <div className="container-foto">
          <img src={show3} alt="evento" />
        </div>
        <div className="container-sobre">
          <div className="descricao-evento">
            <p>Descrição do Evento</p>
            <textarea name="descricao" className="descricao-input"></textarea>
          </div>
        </div>
      </main>
    </div>
  );
}
