import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/sonara-logo.svg";
import "./telaEscolha.css";

export default function TelaEscolha() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Logo Sonara" />
        <p>SONARA</p>
      </header>

      <main className="main">
        <div className="mensagem">
          <h1>BEM-VINDO A SONARA</h1>
          <p>UNIFICANDO IDEIAS, REALIZANDO SONHOS</p>
          <h2>O QUE VOCÊ BUSCA?</h2>

          <div className="botao">
            <button onClick={() => navigate("/login")}>Fazer Login</button>

            <button onClick={() => navigate("/shows")}>
              Continuar sem Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
