import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./telaperfilArtista.css";
import fotoPerfil from "../img/fotoPerfil.jpg";
import { atualizarUsuario } from "../services/usuarioService";
import { deletarUsuario } from "../services/usuarioService";
import { buscarGeneros } from "../services/generoService";
import { buscarNacionalidades } from "../services/nacionalidadeService";
import Header from "./Header";

export default function PerfilArtista() {
  const navigate = useNavigate();
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(fotoPerfil);
  const inputFileRef = useRef(null);
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [generos, setGeneros] = useState([]);
  const [nacionalidades, setNacionalidades] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    data_nasc: "",
    email: "",
    telefone: "",
    nacionalidade_id: "",
    genero_id: "",
    cpf: "",
    senha: "",
    endereco_id: "",
  });

  const [idUsuario, setIdUsuario] = useState(null);

  // Carrega dados do usuário logado
  useEffect(() => {
    const usuarioSalvo = sessionStorage.getItem("usuario");
    if (usuarioSalvo) {
      const u = JSON.parse(usuarioSalvo);
      setIdUsuario(u.id_usuario);
      setForm({
        nome: u.nome || "",
        data_nasc: u.data_nasc?.split("T")[0] || "",
        email: u.email || "",
        telefone: u.telefone || "",
        nacionalidade_id: u.nacionalidade_id || "",
        genero_id: u.genero_id || "",
        cpf: u.cpf || "",
        senha: u.senha || "",
        endereco_id: u.endereco_id || "",
      });
    } else {
      navigate("/login");
    }

    buscarGeneros()
      .then((data) => setGeneros(data.response.generos ?? []))
      .catch(() => {});

    buscarNacionalidades()
      .then((data) => setNacionalidades(data.response.nacionalidades ?? []))
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setErro("");
    setSucesso("");
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  const handleFotoClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setFotoPerfilUrl(imageUrl);
  };

  async function handleSalvar() {
    if (!idUsuario) return;
    setSalvando(true);
    setErro("");
    setSucesso("");
    try {
      const resultado = await atualizarUsuario(idUsuario, form);
      if (resultado.status_code === 200) {
        setSucesso("Dados atualizados com sucesso!");
        const usuarioAtualizado = {
          ...JSON.parse(sessionStorage.getItem("usuario")),
          ...form,
        };
        sessionStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      } else {
        setErro(resultado.message || "Erro ao atualizar.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar() {
    if (!idUsuario) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita.",
    );
    if (!confirmar) return;

    setDeletando(true);
    setErro("");
    setSucesso("");

    try {
      const resultado = await deletarUsuario(idUsuario);

      if (resultado.status_code === 200) {
        setSucesso("Conta deletada com sucesso!");
        sessionStorage.removeItem("usuario");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setErro(resultado.message || "Erro ao deletar.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setDeletando(false);
    }
  }

  function handleCancelar() {
    const u = JSON.parse(sessionStorage.getItem("usuario"));
    if (u) {
      setForm({
        nome: u.nome || "",
        data_nasc: u.data_nasc?.split("T")[0] || "",
        email: u.email || "",
        telefone: u.telefone || "",
        nacionalidade_id: u.nacionalidade_id || "",
        genero_id: u.genero_id || "",
        cpf: u.cpf || "",
        senha: u.senha || "",
        endereco_id: u.endereco_id || "",
      });
    }
    setErro("");
    setSucesso("");
  }

  return (
    <div className="pa-wrapper">
      <div className="pa-central">
        {/* LEFT COLUMN */}
        <div className="pa-col-left">
          <div className="pa-foto-wrapper">
            <div className="pa-foto-circle">
              {fotoPerfilUrl ? (
                <img src={fotoPerfilUrl} alt="Artista" />
              ) : (
                <div className="pa-foto-placeholder" />
              )}
            </div>
            <button
              className="pa-edit-btn"
              title="Editar foto"
              onClick={handleFotoClick}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <input
              type="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="pa-plano-card">
            <div className="pa-plano-header">
              <span className="pa-plano-titulo">Plano Diamante</span>
              <svg
                className="pa-plano-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
            <p className="pa-plano-desc">
              "O plano definitivo para artistas estabelecidos. Tenha acesso
              ilimitado a todas as ferramentas da plataforma, analytics
              avançados, posicionamento premium nas buscas e suporte dedicado
              24/7. Maximize sua visibilidade e alcance novos patamares na sua
              carreira."
            </p>
          </div>

          <div className="pa-plano-card pa-plano-card--secondary">
            <div className="pa-plano-header">
              <span className="pa-plano-titulo">Plano Platina</span>
              <svg
                className="pa-plano-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
            <p className="pa-plano-desc">
              "Acesse recursos exclusivos para artistas em crescimento. Divulgue
              seus eventos para um público maior, receba suporte prioritário e
              tenha destaque nas buscas da plataforma. Ideal para quem está
              começando a construir sua presença no cenário musical."
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="pa-col-right">
          <div className="pa-eventos-card">
            <h3 className="pa-card-title">Meus Eventos</h3>
            <div className="pa-eventos-content">
              <div className="pa-eventos-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="pa-evento-thumb">
                    <div className="pa-thumb-placeholder" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pa-dados-card">
            <h3 className="pa-card-title">Dados de Artista</h3>
            <div className="pa-dados-grid">
              <input
                className="pa-input"
                id="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome"
              />
              <input
                className="pa-input"
                id="data_nasc"
                type="date"
                value={form.data_nasc}
                onChange={handleChange}
              />
              <input
                className="pa-input"
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                className="pa-input"
                id="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone"
              />

              <select
                className="pa-input"
                id="nacionalidade_id"
                value={form.nacionalidade_id}
                onChange={handleChange}
              >
                <option value="">Nacionalidade</option>
                {nacionalidades.map((n) => (
                  <option key={n.id_nacionalidade} value={n.id_nacionalidade}>
                    {n.nome}
                  </option>
                ))}
              </select>

              <select
                className="pa-input"
                id="genero_id"
                value={form.genero_id}
                onChange={handleChange}
              >
                <option value="">Gênero</option>
                {generos.map((g) => (
                  <option key={g.id_genero} value={g.id_genero}>
                    {g.nome}
                  </option>
                ))}
              </select>

              {erro && (
                <p style={{ color: "red", gridColumn: "1/-1" }}>{erro}</p>
              )}
              {sucesso && (
                <p style={{ color: "green", gridColumn: "1/-1" }}>{sucesso}</p>
              )}
            </div>

            <div className="pa-dados-actions">
              <button
                className="pa-btn pa-btn-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
              <button
                className="pa-btn pa-btn-salvar"
                onClick={handleSalvar}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>

              <button
                className="pa-btn pa-btn-salvar"
                onClick={handleDeletar}
                disabled={salvando}
              >
                {salvando ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
