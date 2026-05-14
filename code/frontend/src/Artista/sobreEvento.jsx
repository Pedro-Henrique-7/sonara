import { useNavigate } from "react-router-dom";
import "./sobreEvento.css";
import fotoShow from "../img/fotoShow.png";
import fotoPerfil from "../img/fotoPerfil.jpg";
import Header from "./Header";

export default function SobreEvento() {
  const navigate = useNavigate();
  const usuario = sessionStorage.getItem("usuario");
  const usuarioObj = usuario ? JSON.parse(usuario) : null;
  return (
    <div className="main-wrapper">
      <Header />
      <main className="container-principal">
        {/* ESQUERDA */}
        <div className="left">
          <img src={fotoShow} alt="Evento" className="main-img" />

          <div className="stars">★★★★★</div>

          <div className="thumbs">
            {[1, 2, 3, 4, 5].map((i) => (
              <img key={i} src={fotoShow} alt="" />
            ))}
          </div>
        </div>

        {/* DIREITA */}
        <div className="right">
          <div className="form-box">
            <section className="evento-nome">
              <label>Nome do evento</label>
              <p>Nome do Evento</p>
            </section>

            <section className="evento-descricao">
              <label>Descrição:</label>
              <p>Descrição do evento</p>
            </section>

            <div className="evento-row">
              <section className="evento-data">
                <label>DATA</label>
                <p>DD/MM/AAAA</p>
              </section>

              <section className="evento-hora">
                <label>HORA</label>
                <p>00:00</p>
              </section>
            </div>

            <button onClick={() => navigate("/eventoInscricao")}>
              Inscreva-se
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
