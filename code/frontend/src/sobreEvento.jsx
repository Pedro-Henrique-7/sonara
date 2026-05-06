import { useNavigate } from "react-router-dom";
import "./sobreEvento.css";
import fotoShow from "./img/fotoShow.png";
import fotoPerfil from "./img/fotoPerfil.jpg";

export default function SobreEvento() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      <header>
        <div className="content-limit">
          {" "}
          <div className="header-top">
            <nav className="nav">
              <span className="nav-item">Home</span>
              <span className="nav-item">Buscar</span>
              <span className="nav-item" onClick={() => navigate("")}>
                Meus Eventos
              </span>
              <span className="nav-item">Plano</span>
            </nav>

            <div className="user">
              <div className="user-info">
                <span className="user-name">Yuri Silva</span>
                <span className="user-role">Artista</span>
              </div>
              <div className="avatar">
                <img src={fotoPerfil} alt="Perfil" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-principal">
        {/* ESQUERDA
        <div className="left">
          <img src={fotoShow} alt="Evento" className="main-img" />

          <div className="stars">★★★★★</div>

          <div className="thumbs">
            {[1, 2, 3, 4, 5].map((i) => (
              <img key={i} src={fotoShow} alt="" />
            ))}
          </div>
        </div> */}

        {/* DIREITA */}
        <div className="right">
          <div className="form-box">
            <label>Nome do evento</label>
            <input type="text" />

            <label>Descrição:</label>
            <textarea></textarea>

            <div className="row">
              <div>
                <label>DATA</label>
                <input type="text" placeholder="DD/MM/AAAA" />
              </div>

              <div>
                <label>HORA</label>
                <input type="text" placeholder="00:00" />
              </div>
            </div>

            <button onClick={() => navigate("/inscricao")}>Inscreva-se</button>
          </div>
        </div>
      </main>
    </div>
  );
}
