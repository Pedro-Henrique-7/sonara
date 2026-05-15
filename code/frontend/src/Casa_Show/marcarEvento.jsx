import "./marcarEvento.css";
import { useNavigate } from "react-router-dom";
import show1 from "../img/show1.jfif";
import show2 from "../img/show2.webp";
import show3 from "../img/show3.png";

export default function AlgumaTela() {
  const navigate = useNavigate();
  return (
    <div className="pagina">
      <main className="main">
        <section className="card-evento">
          <div className="galeria">
            <div className="miniaturas">
              <img src={show2} alt="" />

              <div className="mais-fotos">+3</div>
            </div>

            <button className="btn-fotos">Adicionar mais fotos</button>
          </div>

          <div className="formulario">
            <label>nome do evento:</label>
            <input type="text" placeholder="Digite aqui" />

            <label>Descrição:</label>
            <textarea placeholder="Digite aqui"></textarea>

            <div className="linha-inputs">
              <div className="campo">
                <label>DATA</label>
                <input type="text" placeholder="DD/MM/AAAA" />
              </div>

              <div className="campo">
                <label>HORA</label>
                <input type="text" placeholder="00:00" />
              </div>
            </div>

            {/* ENDEREÇO */}

            <div className="endereco-section">
              <h2>Endereço</h2>

              <div className="campo">
                <label>CEP</label>
                <input type="text" placeholder="00000-000" />
              </div>
              <div className="linha-inputs">
                <div className="campo">
                  <label>Rua</label>
                  <input type="text" placeholder="Digite a rua" />
                </div>
                <div className="campo">
                  <label>Número</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>

              <div className="linha-inputs">
                <div className="campo">
                  <label>Bairro</label>
                  <input type="text" placeholder="Digite o bairro" />
                </div>

                <div className="campo">
                  <label>Cidade</label>
                  <input type="text" placeholder="Digite a cidade" />
                </div>
              </div>
            </div>

            <button className="btn-marcar">Marcar Evento</button>
          </div>
        </section>
      </main>
    </div>
  );
}
