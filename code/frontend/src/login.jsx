import { useNavigate } from "react-router-dom";
import "./login.css";
import "./index.css";
import logo from "./img/sonara-logo.svg";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <header>
        <img src={logo} alt="Logo Sonara" />
        <p>SONARA</p>
      </header>

      <main>
        <div className="caixa">
          <p>Bem vindo de volta!</p>

          <div className="grupo1">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" />
          </div>

          <div className="grupo2">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" />{" "}
          </div>

          <button type="button">Entrar</button>

          <div className="recuperacao">
            <span>
              Não tem conta?{" "}
              <a
                href="#"
                style={{ textDecoration: "none", color: "white" }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/cadastro");
                }}
              >
                Cadastre-se
              </a>
            </span>
            <div className="senha">
              <span>
                Esqueceu sua senha?{" "}
                <a
                  href="#"
                  style={{ textDecoration: "none", color: "white" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/recuperar_senha");
                  }}
                >
                  Recuperar
                </a>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
