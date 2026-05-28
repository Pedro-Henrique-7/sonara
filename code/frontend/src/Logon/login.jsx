import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./login.css";
import "../index.css";
import logo from "../img/sonara-logo.svg";
import { loginUsuario, buscarUsuarioPorId } from "../services/usuarioService";

// Mapeia códigos HTTP para mensagens amigáveis ao usuário
function traduzirErroLogin(error, statusCode) {
  if (statusCode === 401)
    return "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";
  if (statusCode === 400)
    return error || "Preencha o e-mail e a senha antes de continuar.";
  if (statusCode === 415)
    return "Erro de comunicação com o servidor. Tente novamente.";
  if (statusCode >= 500)
    return "O servidor está indisponível no momento. Tente novamente em alguns minutos.";
  return error || "Ocorreu um erro inesperado. Tente novamente.";
}

function Login() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [campoErro, setCampoErro] = useState({ email: false, senha: false });

  const navigate = useNavigate();

  function validarFormulario() {
    const erros = { email: false, senha: false };
    let mensagem = "";

    if (!email.trim()) {
      erros.email = true;
      mensagem = "O campo e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      erros.email = true;
      mensagem = "Informe um e-mail válido.";
    } else if (!senha.trim()) {
      erros.senha = true;
      mensagem = "O campo senha é obrigatório.";
    } else if (senha.length < 8) {
      erros.senha = true;
      mensagem = "A senha deve ter pelo menos 8 caracteres.";
    }

    setCampoErro(erros);
    setErro(mensagem);
    return mensagem === "";
  }

  const handleSubmit = async () => {
    setErro("");
    setCampoErro({ email: false, senha: false });

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const response = await loginUsuario(email, senha);

      if (response.status === true) {
        const usuarioLogin = response.usuario;
        const token = response.token;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("usuario", JSON.stringify(usuarioLogin));

        try {
          const usuarioCompletoResponse = await buscarUsuarioPorId(
            usuarioLogin.id_usuario,
          );

          const usuarioCompleto = usuarioCompletoResponse?.response?.usuario;

          if (usuarioCompleto) {
            sessionStorage.setItem("usuario", JSON.stringify(usuarioCompleto));

            if (usuarioCompleto.tipo_usuario === "Artista") {
              navigate("/shows");
            } else if (usuarioCompleto.tipo_usuario === "Organizador") {
              navigate("/casaShow");
            } else {
              navigate("/telaDeUsuario");
            }

            return;
          }
        } catch (error) {
          console.error("Erro ao buscar usuário completo:", error);
        }

        if (usuarioLogin.tipo_usuario === "Artista") {
          navigate("/shows");
        } else if (usuarioLogin.tipo_usuario === "Organizador") {
          navigate("/organizador");
        } else {
          navigate("/");
        }
      } else {
        setErro(response.message || "Erro ao fazer login.");
      }
    } catch (error) {
      setErro(traduzirErroLogin(error.message, error.status_code));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
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
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErro("");
                setCampoErro((prev) => ({ ...prev, email: false }));
              }}
              onKeyDown={handleKeyDown}
              style={campoErro.email ? { border: "2px solid #ffe0e0" } : {}}
              placeholder="seu@email.com"
            />
          </div>

          <div className="grupo2">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErro("");
                setCampoErro((prev) => ({ ...prev, senha: false }));
              }}
              onKeyDown={handleKeyDown}
              style={campoErro.senha ? { border: "2px solid #ffe0e0" } : {}}
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <p
              role="alert"
              style={{
                color: "#fff",
                background: "rgba(0,0,0,0.25)",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "0.85rem",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              {erro}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Entrando…" : "Entrar"}
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
