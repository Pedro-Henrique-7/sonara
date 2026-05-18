import "./footerSonara.css";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function FooterSonara() {
  return (
    <footer className="footerSonara">
      <div className="footerSonaraTopo"></div>

      <div className="footerSonaraConteudo">
        <div className="footerSonaraColuna">
          <h2 className="footerSonaraTitulo">NOSSO ENDEREÇO:</h2>

          <p className="footerSonaraTexto">JandiraCity, 123-São Paulo-SP</p>
        </div>

        <div className="footerSonaraColuna">
          <h2 className="footerSonaraTitulo footerSonaraAzul">SOBRE NÓS:</h2>

          <p className="footerSonaraTexto footerSonaraAzul">
            Lorem Ipsum is simply dummy text of the
            <br />
            printing and typesetting industry.
          </p>
        </div>

        <div className="footerSonaraColuna">
          <h2 className="footerSonaraTitulo">CONTATO:</h2>

          <p className="footerSonaraTexto">Email: sonara@gmail.com.br</p>

          <p className="footerSonaraTexto">Telefone: (11) 99999-9999</p>
        </div>
      </div>

      <div className="footerSonaraBottom">
        <p className="footerSonaraDireitos">
          Todos os direitos reservados sonara.com.br
        </p>

        <div className="footerSonaraRedes">
          <FaFacebookF className="footerSonaraIcone facebook" />
          <FaYoutube className="footerSonaraIcone youtube" />
          <FaXTwitter className="footerSonaraIcone x" />
        </div>
      </div>
    </footer>
  );
}
