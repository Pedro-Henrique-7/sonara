import "./sobreArtista.css";
import { useState } from "react";

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
  const [abrirContraProposta, setAbrirContraProposta] = useState(false); // ← faltava
  const [valorProposta, setValorProposta] = useState("");

  function formatarMoeda(valor) {
    const apenasDigitos = valor.replace(/\D/g, "");
    if (!apenasDigitos) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseInt(apenasDigitos, 10) / 100);
  }

  function handleValorChange(e) {
    setValorProposta(formatarMoeda(e.target.value));
  }

  function handleValorKeyDown(e) {
    const permitidos = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    if (permitidos.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  }

  function enviarContraProposta() {
    alert("Contra proposta enviada com sucesso!");
    setValorProposta("");
    setAbrirContraProposta(false);
  }

  return (
    <>
      <HeaderCasaShow />

      <main className="sonaraSobreArtistaPagina">
        <div className="sonaraSobreArtistaContainer">
          <h1 className="sonaraSobreArtistaTitulo">Ver Artista</h1>

          <div className="sonaraSobreArtistaCard">
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

            <div className="sonaraSobreArtistaLocal">
              <FaMapMarkerAlt className="sonaraSobreArtistaLocalIcone" />
              <p>Jandira, Street Vicent nº12</p>
            </div>

            <div className="sonaraSobreArtistaDescricao">
              <p>
                Minha música mistura jazz, soul e influências modernas para
                criar algo autêntico e cheio de sentimento.
              </p>
            </div>

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

            <div className="sonaraSobreArtistaBotoes">
              <button className="sonaraSobreArtistaBtn">Reprovar</button>

              <button className="sonaraSobreArtistaBtn">Aprovar</button>
              <button
                className="sonaraSobreArtistaBtn"
                onClick={() => setAbrirContraProposta(true)}
              >
                Contra Proposta
              </button>
              <button className="sonaraSobreArtistaBtn">Salvar</button>
            </div>
          </div>
        </div>

        {abrirContraProposta && (
          <div className="sonaraModalOverlay">
            <div className="sonaraModal">
              <h2>Enviar Contra Proposta</h2>

              <input
                type="text"
                placeholder="R$ 0,00"
                inputMode="numeric"
                className="sonaraModalInput"
                value={valorProposta}
                onChange={handleValorChange}
                onKeyDown={handleValorKeyDown}
              />

              <textarea
                placeholder="Escreva uma mensagem..."
                className="sonaraModalTextarea"
              ></textarea>

              <div className="sonaraModalBotoes">
                <button
                  className="sonaraModalCancelar"
                  onClick={() => setAbrirContraProposta(false)}
                >
                  Cancelar
                </button>
                <button
                  className="sonaraModalEnviar"
                  onClick={enviarContraProposta}
                >
                  Enviar Proposta
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <FooterSonara />
    </>
  );
}
