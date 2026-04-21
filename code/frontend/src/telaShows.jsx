import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./img/sonara-logo.svg";
import "./telaShows.css";
import { Search } from "lucide-react";

const imagens = ["/img/show1.jpg", "/img/show2.jpg", "/img/show3.jpg"];

export default function Shows() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <div className="header-top">
          <nav className="nav">
            <span className="nav-item">Home</span>
            <span className="nav-item">Buscar</span>
            <span className="nav-item">Meus Eventos</span>
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

        <div className="search-bar">
          <span className="search-placeholder">Pesquisar</span>
          <Search size={18} color="#fff" />
        </div>
      </header>

      {/* SLIDER */}
      <h3 className="titulo">Eventos Próximos</h3>

      <div className="slider">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {imagens.map((img, i) => (
            <div className="slide" key={i}>
              <img src={img} alt={`evento-${i}`} />
            </div>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="card" key={i}>
            <img src="/img/show-1.jpg" alt="evento" />
            <button>Ver Mais</button>
          </div>
        ))}
      </div>
    </div>
  );
}
