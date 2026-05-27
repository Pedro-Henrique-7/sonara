import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/sonara-logo.svg";
import "./telaEscolha.css";
export default function TelaEscolha() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="app">
      <header className="header-escolha">
        <img src={logo} alt="Logo Sonara" /> <p>SONARA</p>{" "}
      </header>{" "}
      <main className="main-escolha">
        <div className="mensagem-escolha">
          <h2>BEM-VINDO A SONARA</h2>{" "}
          <p>UNIFICANDO IDEIAS, REALIZANDO SONHOS</p> <h2>O QUE VOCÊ BUSCA?</h2>
          <div className="botao-escolha">
            <button onClick={() => navigate("/login")}>Fazer Login</button>
            <button onClick={() => navigate("/telaDeUsuario")}>
              Entrar sem Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
