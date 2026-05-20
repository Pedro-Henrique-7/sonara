import "./sobreArtista.css";

import HeaderCasaShow from "./headerCasaShow";
import FooterSonara from "../Artista/footer";

import {
  FaFacebookF,
  FaSpotify,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";

export default function SobreArtista() {
  return (
    <>
      <HeaderCasaShow />

      <main className="sonaraSobreArtistaPagina">
        <div className="sonaraSobreArtistaContainer">
          <h1 className="sonaraSobreArtistaTitulo">Ver Artista</h1>

          <div className="sonaraSobreArtistaCard">
            {/* TOPO */}
            <div className="sonaraSobreArtistaTopo">
              <div className="sonaraSobreArtistaFotoArea">
                <img
                  src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop"
                  alt="Artista"
                  className="sonaraSobreArtistaFoto"
                />
              </div>

              <div className="sonaraSobreArtistaInfo">
                <h2>Pedro Henrique</h2>

                <span>Jazz e Clássica</span>

                <p>(11) 98017-0001</p>

                <div className="sonaraSobreArtistaAvaliacao">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar className="sonaraSobreArtistaStarOff" />
                </div>
              </div>
            </div>

            {/* LOCAL */}
            <div className="sonaraSobreArtistaLocal">
              <FaMapMarkerAlt className="sonaraSobreArtistaLocalIcone" />

              <p>Jandira, Street Vicent nº12</p>
            </div>

            {/* DESCRIÇÃO */}
            <div className="sonaraSobreArtistaDescricao">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* CACHE + REDES */}
            <div className="sonaraSobreArtistaRodapeInfo">
              <div className="sonaraSobreArtistaCache">
                <h3>Cachê Pretendido:</h3>

                <span>XXXXX</span>
              </div>

              <div className="sonaraSobreArtistaRedes">
                <a href="/">
                  <FaFacebookF />
                </a>

                <a href="/">
                  <FaSpotify />
                </a>

                <a href="/">
                  <FaInstagram />
                </a>

                <a href="/">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* BOTÕES */}
            <div className="sonaraSobreArtistaBotoes">
              <button className="sonaraSobreArtistaBtn">Reprovar</button>

              <button className="sonaraSobreArtistaBtn">Aprovar</button>

              <button className="sonaraSobreArtistaBtn">Contra Proposta</button>

              <button className="sonaraSobreArtistaBtn">Salvar</button>
            </div>
          </div>
        </div>
      </main>

      <FooterSonara />
    </>
  );
}
