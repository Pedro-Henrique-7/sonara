import "./eventoInscricao.css";
import Header from "./header";
import FooterSonara from "./footer";

export default function EventoInscricao() {
  return (
    <div className="pa-wrapper">
      {/* HEADER */}
      <Header />
      {/* MAIN */}
      <main className="main-central">
        <div className="card-inscricao">
          <div className="campo">
            <label>Conte sobre você:</label>

            <textarea placeholder="Escreva sua História" />
          </div>

          <div className="campo">
            <label>Por que você deveria cantar aqui?</label>

            <textarea placeholder="Escreva sua Motivação" />
          </div>

          <div className="campo-cache">
            <label>Cachê Pretendido</label>

            <input type="text" placeholder="Quanto sua Arte Vale?" />
          </div>

          <button
            className="btn-inscricao"
            onClick={() => alert("Candidatura enviada com sucesso")}
          >
            Candidatar-se
          </button>
        </div>
      </main>

      <FooterSonara />
    </div>
  );
}
