import "./contratarArtista.css";
import { FaEye, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HeaderCasaShow from "./headerCasaShow.jsx";
import FooterSonara from "../Artista/footer.jsx";

export default function TelaContratarArtistas() {
  const navigate = useNavigate();

  const listaArtistasSonara = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    nome: "Pedro",
    profissao: "Artista Musical",
    cidade: "Jandira",
    estilo: "Eletrônica & Clássica",
  }));

  return (
    <div className="sonaraContratarPagina">
      <HeaderCasaShow />
      <main className="sonaraContratarConteudo">
        <h1 className="sonaraContratarTitulo">Artistas Próximos</h1>

        <div className="sonaraContratarGrid">
          {listaArtistasSonara.map((artista) => (
            <div className="sonaraContratarCard" key={artista.id}>
              <div className="sonaraContratarCardTopo">
                <div className="sonaraContratarFoto"></div>
              </div>

              <div className="sonaraContratarCardConteudo">
                <h2>{artista.nome}</h2>

                <span>{artista.profissao}</span>

                <div className="sonaraContratarEstrelas">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar className="sonaraContratarEstrelaOff" />
                </div>

                <p>{artista.cidade}</p>

                <small>{artista.estilo}</small>

                <button
                  className="sonaraContratarBtnVerMais"
                  onClick={() => navigate("/sobreArtista")}
                >
                  <FaEye />
                  Ver mais
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <FooterSonara />
    </div>
  );
}
