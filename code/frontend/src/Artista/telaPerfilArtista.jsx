import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./telaPerfilArtista.css";
import fotoPerfil from "../img/fotoPerfil.jpg";
import {
  atualizarUsuario,
  atualizarFotoUsuario,
  deletarUsuario,
} from "../services/usuarioService";
import { buscarGeneros } from "../services/generoService";
import { buscarNacionalidades } from "../services/nacionalidadeService";
import { buscarGeneroMusical } from "../services/generoMusicalService";
import Header from "./header";
import FooterSonara from "./footer";

const PLACEHOLDER_IMG =
  "https://placehold.co/600x300/1a1a2e/ffffff?text=Sem+Foto";

export default function PerfilArtista() {
  const navigate = useNavigate();
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(fotoPerfil);
  const inputFileRef = useRef(null);
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [generos, setGeneros] = useState([]);
  const [generoMusical, setGenerosMusicais] = useState([]);
  const [nacionalidades, setNacionalidades] = useState([]);
  const [meusEventos, setMeusEventos] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    nome: "",
    data_nasc: "",
    email: "",
    telefone: "",
    nacionalidade_id: "",
    genero_id: "",
    cpf: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    nome_artistico: "",
    descricao: "",
    generos_musicais: [],
  });

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickFora(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  useEffect(() => {
    const usuarioSalvo = sessionStorage.getItem("usuario");
    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    const u = JSON.parse(usuarioSalvo);
    setIdUsuario(u.id_usuario);
    setTipoUsuario(u.tipo_usuario || "");

    // ── FOTO ──────────────────────────────────────────────────────────────
    // A foto vem direto em u.foto (campo da vw_usuario_completo)
    if (u.foto) setFotoPerfilUrl(u.foto);

    // ── ENDEREÇO ──────────────────────────────────────────────────────────
    // O backend retorna u.endereco como objeto aninhado
    const end = u.endereco || {};

    // ── ARTISTA ───────────────────────────────────────────────────────────
    // Dados artísticos ficam em u.artista
    const artista = u.artista || {};

    // Os gêneros musicais do artista têm chave "id" (não id_genero_musical)
    // Exemplo: [{ id: 41, nome: "Trap" }, { id: 40, nome: "Hard Rock" }]
    const generosMusicalIds = artista.generos_musicais?.map((g) => g.id) ?? [];

    // ── GENERO / NACIONALIDADE ─────────────────────────────────────────────
    // Chegam como objetos: u.genero = { id_genero, nome }
    //                      u.nacionalidade = { id_nacionalidade, nome }
    const generoId = u.genero?.id_genero ?? "";
    const nacionalidadeId = u.nacionalidade?.id_nacionalidade ?? "";

    setForm({
      nome: u.nome || "",
      data_nasc: u.data_nasc?.split("T")[0] || "",
      email: u.email || "",
      telefone: u.telefone || "",
      cpf: u.cpf || "",
      nacionalidade_id: nacionalidadeId,
      genero_id: generoId,
      // Endereço aninhado
      cep: end.cep || "",
      logradouro: end.logradouro || "",
      numero: end.numero || "",
      complemento: end.complemento || "",
      bairro: end.bairro || "",
      cidade: end.cidade || "",
      estado: end.estado || "",
      // Artista aninhado
      nome_artistico: artista.nome_artistico || "",
      descricao: artista.descricao || "",
      generos_musicais: generosMusicalIds,
    });

    // Eventos do artista (se houver)
    if (artista.eventos && artista.eventos.length > 0) {
      setMeusEventos(artista.eventos);
    }

    buscarGeneros()
      .then((data) => setGeneros(data.response?.generos ?? []))
      .catch(() => {});

    buscarNacionalidades()
      .then((data) => setNacionalidades(data.response?.nacionalidades ?? []))
      .catch(() => {});

    buscarGeneroMusical()
      .then((data) => setGenerosMusicais(data.response?.GeneroMusical ?? []))
      .catch(() => {});
  }, [navigate]);

  function handleChange(e) {
    setErro("");
    setSucesso("");
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  // Os gêneros musicais da lista da API têm id_genero_musical
  // mas os já salvos no perfil têm apenas "id" — normalizamos para id_genero_musical
  function handleToggleGeneroMusical(idGeneroMusical) {
    setErro("");
    setSucesso("");
    setForm((prev) => {
      const jaSelecionado = prev.generos_musicais.includes(idGeneroMusical);
      return {
        ...prev,
        generos_musicais: jaSelecionado
          ? prev.generos_musicais.filter((gid) => gid !== idGeneroMusical)
          : [...prev.generos_musicais, idGeneroMusical],
      };
    });
  }

  const handleFotoClick = () => inputFileRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setFotoPerfilUrl(URL.createObjectURL(file));
    setErro("");
    setSucesso("");

    try {
      const resultado = await atualizarFotoUsuario(idUsuario, file);
      if (resultado.status_code === 200) {
        const u = JSON.parse(sessionStorage.getItem("usuario"));
        // A resposta do PATCH /:id/foto retorna response.foto
        u.foto = resultado.response.foto;
        sessionStorage.setItem("usuario", JSON.stringify(u));
        setFotoPerfilUrl(resultado.response.foto);
        setSucesso("Foto atualizada com sucesso!");
      } else {
        setErro(resultado.message || "Erro ao atualizar foto.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  };

  function validarForm() {
    if (!form.nome.trim()) return "Nome é obrigatório.";
    if (!form.email.trim()) return "Email é obrigatório.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Email inválido.";
    if (!form.telefone.trim()) return "Telefone é obrigatório.";
    if (!form.cpf.trim()) return "CPF é obrigatório.";
    if (!form.cep.trim()) return "CEP é obrigatório.";
    if (!form.logradouro.trim()) return "Logradouro é obrigatório.";
    if (!form.numero.trim()) return "Número é obrigatório.";
    if (!form.bairro.trim()) return "Bairro é obrigatório.";
    if (!form.cidade.trim()) return "Cidade é obrigatória.";
    if (!form.estado.trim()) return "Estado é obrigatório.";
    return null;
  }

  async function handleSalvar() {
    if (!idUsuario) return;

    const erroValidacao = validarForm();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      const u = JSON.parse(sessionStorage.getItem("usuario"));

      // O backend espera os campos "planos" (sem aninhamento) no PUT /usuario/:id
      // conforme o controller atualizarUsuario
      const payload = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        cpf: form.cpf,
        data_nasc: form.data_nasc,
        nacionalidade_id: Number(form.nacionalidade_id),
        genero_id: Number(form.genero_id),
        // Endereço
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento || "",
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        // Tipo de usuário (necessário para o controller saber se é artista)
        tipo_usuario: u.tipo_usuario,
        // Campos de artista (só usados se tipo_usuario === 'artista')
        nome_artistico: form.nome_artistico,
        descricao: form.descricao,
        generos_musicais: form.generos_musicais,
      };

      const resultado = await atualizarUsuario(idUsuario, payload);

      if (resultado.status_code === 200) {
        setSucesso("Dados atualizados com sucesso!");

        // Atualiza o sessionStorage mantendo a estrutura aninhada
        const usuarioAtualizado = resultado.response?.usuario || u;
        sessionStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
        window.dispatchEvent(new Event("usuarioAtualizado"));
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
        sessionStorage.removeItem("token");
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
    if (!u) return;

    if (u.foto) setFotoPerfilUrl(u.foto);

    const end = u.endereco || {};
    const artista = u.artista || {};
    const generosMusicalIds = artista.generos_musicais?.map((g) => g.id) ?? [];

    setForm({
      nome: u.nome || "",
      data_nasc: u.data_nasc?.split("T")[0] || "",
      email: u.email || "",
      telefone: u.telefone || "",
      cpf: u.cpf || "",
      nacionalidade_id: u.nacionalidade?.id_nacionalidade ?? "",
      genero_id: u.genero?.id_genero ?? "",
      cep: end.cep || "",
      logradouro: end.logradouro || "",
      numero: end.numero || "",
      complemento: end.complemento || "",
      bairro: end.bairro || "",
      cidade: end.cidade || "",
      estado: end.estado || "",
      nome_artistico: artista.nome_artistico || "",
      descricao: artista.descricao || "",
      generos_musicais: generosMusicalIds,
    });

    setDropdownAberto(false);
    setErro("");
    setSucesso("");
  }

  function handleSair() {
    const confirmar = window.confirm("Tem certeza que deseja sair?");
    if (!confirmar) return;
    setSaindo(true);
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("token");
    setTimeout(() => navigate("/"), 2000);
  }

  const isArtista = tipoUsuario?.toLowerCase() === "artista";

  const labelDropdown =
    form.generos_musicais.length === 0
      ? "Selecione os gêneros"
      : `${form.generos_musicais.length} selecionado${form.generos_musicais.length !== 1 ? "s" : ""}`;

  return (
    <div className="pa-wrapper">
      <Header />
      <div className="pa-central">
        {/* LEFT COLUMN */}
        <div className="pa-col-left">
          <div className="pa-foto-wrapper">
            <div className="pa-foto-circle">
              <img
                src={fotoPerfilUrl}
                alt="Artista"
                onError={(e) => {
                  e.target.src = fotoPerfil;
                }}
              />
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
              O plano definitivo para artistas estabelecidos. Tenha acesso
              ilimitado a todas as ferramentas da plataforma, analytics
              avançados, posicionamento premium nas buscas e suporte dedicado
              24/7.
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
              Acesse recursos exclusivos para artistas em crescimento. Divulgue
              seus eventos para um público maior e tenha destaque nas buscas da
              plataforma.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="pa-col-right">
          {/* MEUS EVENTOS */}
          <div className="pa-eventos-card">
            <h3 className="pa-card-title">Meus Eventos</h3>
            <div className="pa-eventos-content">
              {meusEventos.length === 0 ? (
                <p style={{ color: "#888", fontSize: "0.9rem" }}>
                  Nenhum evento encontrado.
                </p>
              ) : (
                <div className="pa-eventos-grid">
                  {meusEventos.map((ev) => (
                    <div
                      key={ev.id_evento}
                      className="pa-evento-thumb"
                      onClick={() => navigate(`/sobreEvento/${ev.id_evento}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={ev.fotos?.[0]?.caminho || PLACEHOLDER_IMG}
                        alt={ev.evento_nome || ev.nome}
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMG;
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DADOS */}
          <div className="pa-dados-card">
            <h3 className="pa-card-title">Dados Pessoais</h3>
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

              <input
                className="pa-input"
                id="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="CPF"
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
            </div>

            {/* ENDEREÇO */}
            <h3 className="pa-card-title" style={{ marginTop: "1.2rem" }}>
              Endereço
            </h3>
            <div className="pa-dados-grid">
              <input
                className="pa-input"
                id="cep"
                value={form.cep}
                onChange={handleChange}
                placeholder="CEP"
                maxLength={9}
              />

              <input
                className="pa-input"
                id="logradouro"
                value={form.logradouro}
                onChange={handleChange}
                placeholder="Logradouro"
              />

              <input
                className="pa-input"
                id="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="Número"
              />

              <input
                className="pa-input"
                id="bairro"
                value={form.bairro}
                onChange={handleChange}
                placeholder="Bairro"
              />

              <input
                className="pa-input"
                id="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Cidade"
              />

              <input
                className="pa-input"
                id="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="UF"
                maxLength={2}
              />

              <input
                className="pa-input"
                id="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Complemento"
              />
            </div>

            {/* CAMPOS ARTISTA */}
            {isArtista && (
              <>
                <h3 className="pa-card-title" style={{ marginTop: "1.2rem" }}>
                  Dados Artísticos
                </h3>
                <div className="pa-dados-grid">
                  <input
                    className="pa-input"
                    id="nome_artistico"
                    value={form.nome_artistico}
                    onChange={handleChange}
                    placeholder="Nome artístico"
                  />
                  <input
                    className="pa-input"
                    id="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    placeholder="Descrição / Bio"
                  />
                </div>

                {/* GÊNEROS MUSICAIS — dropdown com checkboxes */}
                <div className="pa-generos-section">
                  <h3 className="pa-card-title">Gêneros Musicais</h3>
                  <div className="pa-generos-dropdown" ref={dropdownRef}>
                    <button
                      type="button"
                      className="pa-generos-trigger"
                      onClick={() => setDropdownAberto((v) => !v)}
                    >
                      <span>{labelDropdown}</span>
                      <svg
                        className={`pa-generos-arrow ${dropdownAberto ? "pa-generos-arrow--aberto" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>

                    {dropdownAberto && (
                      <div className="pa-generos-lista">
                        {generoMusical.length === 0 ? (
                          <p className="pa-generos-vazio">Carregando...</p>
                        ) : (
                          generoMusical.map((g) => {
                            // A lista da API usa id_genero_musical
                            const selecionado = form.generos_musicais.includes(
                              g.id_genero_musical,
                            );
                            return (
                              <label
                                key={g.id_genero_musical}
                                className="pa-generos-item"
                              >
                                <input
                                  type="checkbox"
                                  className="pa-generos-cb"
                                  checked={selecionado}
                                  onChange={() =>
                                    handleToggleGeneroMusical(g.id_genero_musical)
                                  }
                                />
                                <span>{g.nome}</span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {erro && (
              <p style={{ color: "red", marginTop: "0.8rem" }}>{erro}</p>
            )}
            {sucesso && (
              <p style={{ color: "green", marginTop: "0.8rem" }}>{sucesso}</p>
            )}

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
                className="pa-btn pa-btn-deletar"
                onClick={handleSair}
                disabled={saindo}
                style={{
                  backgroundColor: "#555",
                  color: "#fff",
                  marginLeft: "auto",
                }}
              >
                {saindo ? "Saindo..." : "Sair"}
              </button>

              <button
                className="pa-btn pa-btn-deletar"
                onClick={handleDeletar}
                disabled={deletando}
                style={{
                  backgroundColor: "#c0392b",
                  color: "#fff",
                }}
              >
                {deletando ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterSonara />
    </div>
  );
}