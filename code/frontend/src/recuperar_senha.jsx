import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./img/sonara-logo.svg";
import "./Recuperar_Senha.css";

export default function TelaRecuperarSenha() {
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
          <h1>Recupere Sua Senha</h1>
          <p>Preencha os dados afim de Recuperar sua Senha</p>

          <div className="container_credenciais">
            <input
              type="email"
              name="Email Artista"
              placeholder="Digite seu Email"
            />
            <input
              type="password"
              name="Pass Artista"
              placeholder="Digite seu Email novamente"
            />
          </div>
        </div>

        <div className="botao">
          <button>Enviar Solicitação</button>
        </div>
      </main>
    </div>
  );
}
