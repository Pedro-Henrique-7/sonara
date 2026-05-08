import { useNavigate } from "react-router-dom";
import { useState } from "react";    
import "./login.css";
import "./index.css";
import logo from "./img/sonara-logo.svg";
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");         //feedback de erro
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
    setErro("")
    setLoading(true)

    try {
        const response = await axios.post(
            'http://localhost:8080/v1/sonara/usuario/login',
            { email, senha } 
        )

        if (response.data.status_code === 200) {
            sessionStorage.setItem('usuario', JSON.stringify(response.data.response.usuario))
            navigate('/shows')
        }

    } catch (error) {

      console.log(error)
        if (error.response?.status === 400) {
            setErro("Email ou senha incorretos.")
        } else {
            setErro("Erro ao conectar com o servidor.")
        }
    } finally {
        setLoading(false)
    }
}
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

          {erro && <p style={{ color: 'red', fontSize: '0.85rem' }}>{erro}</p>}
          <button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="recuperacao">
            <span>
              Não tem conta?{" "}
              <a href="#" style={{ textDecoration: "none", color: "white" }}
                onClick={(e) => { e.preventDefault(); navigate("/cadastro") }}>
                Cadastre-se
              </a>
            </span>
            <div className="senha">
              <span>
                Esqueceu sua senha?{" "}
                <a href="#" style={{ textDecoration: "none", color: "white" }}
                  onClick={(e) => { e.preventDefault(); navigate("/recuperar_senha") }}>
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
