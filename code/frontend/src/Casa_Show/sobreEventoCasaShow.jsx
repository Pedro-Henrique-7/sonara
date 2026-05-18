import HeaderCasaShow from "./headerCasaShow.jsx";
import "./sobreEventoCasaShow.css";
import fotoShow from "../img/fotoShow.png";
import map from "../img/map.png";
import FooterSonara from "../Artista/footer.jsx";
export default function SobreEvento() {
  return (
    <div className="sobreEventoPagina">
      <HeaderCasaShow />
      <main className="sobreEventoConteudoPrincipal">
        <div className="sobreEventoContainerInformacoes">
          <img
            src={fotoShow}
            alt="evento"
            className="sobreEventoImagemPrincipal"
          />
          <div className="sobreEventoCardImagem">
            <div className="sobreEventoNomeArea">
              <p>Nome:</p>

              <section className="sobreEventoNomeBox">
                <p>Sonara Festival 2024</p>
              </section>
            </div>

            <div className="sobreEventoLinhaInfo">
              <div className="sobreEventoInfoHorario">
                <div className="sobreEventoCampo">
                  <span>Data:</span>

                  <div className="sobreEventoBoxInfo">28/02/2026</div>
                </div>

                <div className="sobreEventoCampo">
                  <span>Início:</span>

                  <div className="sobreEventoBoxInfo">19:30</div>
                </div>

                <div className="sobreEventoCampo">
                  <span>Fim:</span>

                  <div className="sobreEventoBoxInfo">21:30</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sobreEventoContainerSobre">
            <div className="sobreEventoDescricaoArea">
              <label htmlFor="descricao">Descrição do Evento</label>

              <section className="sobreEventoDescricaoBox">
                <p>
                  Este evento reúne amantes de música ao vivo em uma experiência
                  única, com apresentações de artistas renomados, estrutura
                  moderna e ambiente envolvente.
                </p>
              </section>
            </div>

            <div className="sobreEventoLocalizacao">
              <span>Localização:</span>

              <div className="sobreEventoBoxLocalizacao">
                <p>Rua: Loren Ipsum</p>
                <p>Número: 78</p>
                <p>Cidade: Loren Ipsum</p>
                <p>Bairro: Loren Ipsum</p>
                <p>UF: SP</p>
              </div>
            </div>

            <div className="sobreEventoMapaArea">
              <label htmlFor="mapa">Mapa do Evento</label>

              <img src={map} alt="evento" className="sobreEventoMapaImagem" />
            </div>
          </div>
        </div>
      </main>

      <FooterSonara />
    </div>
  );
}
