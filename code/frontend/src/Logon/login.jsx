import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./login.css";
import "../index.css";
import logo from "../img/sonara-logo.svg";
import { loginUsuario } from "../services/usuarioService";

function Login() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErro("");
    setLoading(true);

    try {
      const response = await loginUsuario(email, senha);

      if (response.status === true) {
        const tipoUsuario = response.usuario.tipo_usuario?.toLowerCase();

        sessionStorage.setItem("usuario", JSON.stringify(response.usuario));
        sessionStorage.setItem("token", response.token);
        if (tipoUsuario === "artista") {
          navigate("/shows");
        } else if (tipoUsuario === "organizador") {
          navigate("/casaShow");
        } else {
          navigate("/login");
        }
      } else {
        setErro("Email ou senha incorretos.");
      }
    } catch (error) {
      setErro(error.message || "Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header-login">
        <img className="logo" src={logo} alt="Logo Sonara" />
        <p>SONARA</p>
      </header>

      <main>
        <div className="caixa">
          <p>Bem vindo de volta!</p>

          <div className="grupo1">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grupo2">
            <label htmlFor="senha">Senha</label>

            <input
              type="password"
              id="senha"
              required
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && (
            <p style={{ color: "white", fontSize: "0.85rem" }}>{erro}</p>
          )}

          <button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

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
