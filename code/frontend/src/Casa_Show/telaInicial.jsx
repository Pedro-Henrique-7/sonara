import "./telaInicial.css";
import { useNavigate } from "react-router-dom";
import HeaderCasaShow from "./headerCasaShow.jsx";
import FooterSonara from "../Artista/footer.jsx";

export default function TelaInicial() {
  const navigate = useNavigate();
  const usuarioSalvo = sessionStorage.getItem("usuario") 
    ? JSON.parse(sessionStorage.getItem("usuario")) 
    : null; 
  return (
    <div className="home-container">
      <HeaderCasaShow />
      <main className="main">
        <section className="painel">
          <div className="painel-titulo">
            <h1>Olá {usuarioSalvo?.nome || "usuário"}</h1>
            <h2>O que vamos fazer hoje?</h2>
          </div>

          <div className="cards-grid">
            <div className="card" onClick={() => navigate("/marcarEvento")}>
              Criar Eventos
            </div>

            <div className="card" onClick={() => navigate(`/contratarArtista`)}>
              Contratar Artistas
            </div>

            <div className="card" onClick={() => navigate("/listaMeusEventos")}>
              Meus Eventos
            </div>
          </div>
        </section>
      </main>
      <FooterSonara />
    </div>
  );
}
