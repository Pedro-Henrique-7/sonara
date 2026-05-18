import "./sobreArtista.css";
import {
  FaFacebook,
  FaSpotify,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import HeaderCasaShow from "./headerCasaShow.jsx";
import FooterSonara from "../Artista/footer.jsx";

//import fotoPerfil from "../img/fotoPerfil.jng";

export default function TelaSobreArtista() {
  return (
    <div className="visualizarArtistaPagina">
      <HeaderCasaShow />
      <div className="visualizarArtistaContainer">
        <h2 className="visualizarArtistaTitulo">Ver Artista</h2>

        <section className="visualizarArtistaCard">
          <div className="visualizarArtistaTopo">
            <img
              //src={fotoPerfil}
              alt="Artista"
              className="visualizarArtistaImagem"
            />

            <div className="visualizarArtistaInfo">
              <h1 className="visualizarArtistaNome">Pedro Henrique</h1>

              <p className="visualizarArtistaGenero">Jazz e Clássica</p>

              <p className="visualizarArtistaTelefone">(11) 98017-0001</p>

              <div className="visualizarArtistaEstrelas">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar className="visualizarArtistaEstrelaApagada" />
              </div>
            </div>
          </div>

          <div className="visualizarArtistaLocalizacao">
            <FaMapMarkerAlt className="visualizarArtistaIconeLocal" />

            <p>Jandira, Street Vicent nº12</p>
          </div>

          <p className="visualizarArtistaDescricao">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div className="visualizarArtistaRodape">
            <div className="visualizarArtistaCache">
              <span>Cache Pretendido:</span>
              <strong>XXXXX</strong>
            </div>

            <div className="visualizarArtistaRedes">
              <FaFacebook />
              <FaSpotify />
              <FaInstagram />
              <FaYoutube />
            </div>
          </div>

          <div className="visualizarArtistaBotoes">
            <button className="visualizarArtistaBotao">Reprovar</button>

            <button className="visualizarArtistaBotao">Aprovar</button>

            <button className="visualizarArtistaBotao">Contra Proposta</button>

            <button className="visualizarArtistaBotao">Salvar</button>
          </div>
        </section>
      </div>
      <footer>
        <FooterSonara />
      </footer>
    </div>
  );
}
