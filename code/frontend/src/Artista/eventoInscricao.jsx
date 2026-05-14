import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "./eventoInscricao.css";
import Header from "./header";

import fotoPerfil from "../img/fotoPerfil.jpg";

export default function EventoInscricao() {
  const navigate = useNavigate();
  const usuario = sessionStorage.getItem("usuario");
  const usuarioObj = usuario ? JSON.parse(usuario) : null;
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(fotoPerfil);

  const inputFileRef = useRef(null);

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
    </div>
  );
}
