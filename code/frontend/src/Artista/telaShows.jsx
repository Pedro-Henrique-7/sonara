import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./telaShows.css";
import { Search } from "lucide-react";

import Header from "./Header";

import show1 from "../img/show1.jfif";
import show2 from "../img/show2.webp";
import show3 from "../img/show3.png";
import show4 from "../img/show4.png";

const imagens = [show1, show2, show4];

export default function Shows() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagens.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-wrapper">
      <Header />

      <div className="container">
        <div className="search-wrapper">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar"
              className="search-input"
            />

            <Search size={18} color="#fff" className="search-icon" />
          </div>
        </div>

        <h3 className="titulo">Eventos Próximos</h3>

        <div className="slider">
          <div
            className="slider-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {imagens.map((img, i) => (
              <div className="slide" key={i}>
                <img src={img} alt={`evento-${i}`} />

                <div className="btn-slide">
                  <button>Ver Mais</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 className="titulo">Eventos Para você</h3>

        <div className="grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="card" key={i}>
              <img src={show3} alt="evento" />

              <button onClick={() => navigate("/sobreEvento")}>Ver Mais</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
