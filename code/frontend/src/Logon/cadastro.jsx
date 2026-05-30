import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastro.css";
import logo from "../img/sonara-logo.svg";
import { cadastrarUsuario } from "../services/usuarioService";
import { buscarCep, buscarLatLong } from "../services/enderecoService";
import { buscarGeneros } from "../services/generoService";
import { buscarNacionalidades } from "../services/nacionalidadeService";
import { buscarGeneroMusical } from "../services/generoMusicalService";
import {
  buscarTiposRedesSociais,
  cadastrarRedeSocial,
} from "../services/redeSocialService";

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = ["Pessoal", "Artístico", "Endereço", "Redes"];

// ─── Tradução de erros do backend ─────────────────────────────────────────────
function traduzirErroCadastro(mensagem) {
  if (!mensagem) return "Ocorreu um erro inesperado. Tente novamente.";
  const mapa = {
    "já está cadastrado": mensagem,
    "E-mail": mensagem,
    "CPF": mensagem,
    "nome artístico": mensagem,
    "gênero musical": mensagem,
    "senha deve ter": mensagem,
    "formato do e-mail": mensagem,
    "endereço": mensagem,
    "tipo_usuario": mensagem,
    "500": "Erro interno no servidor. Tente novamente em alguns minutos.",
    "502": "Serviço de armazenamento de imagens indisponível. O cadastro foi realizado sem a foto.",
    "conexão": "Não foi possível conectar ao servidor. Verifique sua internet.",
  };
  for (const [chave, valor] of Object.entries(mapa)) {
    if (mensagem.includes(chave)) return valor;
  }
  return mensagem;
}

// ─── Validação por step ───────────────────────────────────────────────────────
function validarStep(step, form) {
  const erros = {};

  if (step === 0) {
    if (!form.nome.trim()) erros.nome = "Nome completo é obrigatório.";
    if (!form.email.trim()) erros.email = "E-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      erros.email = "Informe um e-mail válido.";
    if (form.email !== form["confirm-email"])
      erros["confirm-email"] = "Os e-mails não coincidem.";
    if (!form.senha) erros.senha = "Senha é obrigatória.";
    else if (form.senha.length < 8)
      erros.senha = "A senha deve ter pelo menos 8 caracteres.";
    else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(form.senha))
      erros.senha = "Use: letra maiúscula, número e caractere especial (!@#$%^&*).";
    if (form.senha !== form["confirm-senha"])
      erros["confirm-senha"] = "As senhas não coincidem.";
    if (!form.cpf.trim()) erros.cpf = "CPF é obrigatório.";
    if (!form.data_nasc) erros.data_nasc = "Data de nascimento é obrigatória.";
    if (!form.nacionalidade_id) erros.nacionalidade_id = "Selecione uma nacionalidade.";
    if (!form.genero_id) erros.genero_id = "Selecione um gênero.";
    if (!form.tipo_usuario) erros.tipo_usuario = "Selecione o tipo de usuário.";
  }

  if (step === 1 && form.tipo_usuario === "artista") {
    if (!form.nome_artistico.trim())
      erros.nome_artistico = "Nome artístico é obrigatório.";
    if (form.generos_musicais.length === 0)
      erros.generos_musicais = "Selecione pelo menos um gênero musical.";
  }

  if (step === 2) {
    if (!form.cep.trim()) erros.cep = "CEP é obrigatório.";
    if (!form.logradouro.trim()) erros.logradouro = "Rua/logradouro é obrigatório.";
    if (!form.numero.trim()) erros.numero = "Número é obrigatório.";
    if (!form.bairro.trim()) erros.bairro = "Bairro é obrigatório.";
    if (!form.cidade.trim()) erros.cidade = "Cidade é obrigatória.";
    if (!form.estado.trim()) erros.estado = "Estado é obrigatório.";
  }

  if (step === 3) {
    const redesInvalidas = form._redesSociais?.some(
      (rs) => !rs.tipo_id || !rs.link.trim()
    );
    if (redesInvalidas)
      erros.redesSociais = "Preencha a plataforma e o link de todas as redes adicionadas.";
  }

  return erros;
}

// ─── Componente principal ─────────────────────────────────────────────────────
function Cadastro() {
  const navigate = useNavigate();

  const [stepAtual, setStepAtual] = useState(0);
  const [stepsOk, setStepsOk] = useState([]);
  const [erros, setErros] = useState({});

  const [erroGlobal, setErroGlobal] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [statusCep, setStatusCep] = useState(null);
  const [msgCep, setMsgCep] = useState("");

  const [generos, setGeneros] = useState([]);
  const [nacionalidades, setNacionalidades] = useState([]);
  const [generosMusical, setGenerosMusical] = useState([]);
  const [tiposRedesSociais, setTiposRedesSociais] = useState([]);
  const [redesSociais, setRedesSociais] = useState([]);

  const [form, setForm] = useState({
    nome: "", email: "", "confirm-email": "",
    senha: "", "confirm-senha": "",
    cpf: "", data_nasc: "",
    nacionalidade_id: "", genero_id: "",
    telefone: "", tipo_usuario: "",
    nome_artistico: "", descricao: "",
    generos_musicais: [],
    cep: "", cidade: "", estado: "",
    logradouro: "", numero: "", complemento: "", bairro: "",
    foto: null,
  });

  useEffect(() => {
    buscarGeneros()
      .then((d) => setGeneros(d.response?.generos ?? []))
      .catch(() => setErroGlobal("Erro ao carregar gêneros."));
    buscarNacionalidades()
      .then((d) => setNacionalidades(d.response?.nacionalidades ?? []))
      .catch(() => setErroGlobal("Erro ao carregar nacionalidades."));
    buscarGeneroMusical()
      .then((d) => setGenerosMusical(d.response?.GeneroMusical ?? []))
      .catch(() => setErroGlobal("Erro ao carregar gêneros musicais."));
    buscarTiposRedesSociais()
      .then((d) => setTiposRedesSociais(d.response?.TipoRedesSociais ?? []))
      .catch(() => setErroGlobal("Erro ao carregar tipos de redes sociais."));
  }, []);

  // ── Handlers genéricos ────────────────────────────────────────────────────
  function handleChange(e) {
    const { id, value } = e.target;
    setErros((prev) => ({ ...prev, [id]: undefined }));
    setErroGlobal("");
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  function handleFotoChange(e) {
    const arquivo = e.target.files[0] || null;
    if (arquivo) {
      const tipos = ["image/jpeg", "image/png", "image/webp"];
      if (!tipos.includes(arquivo.type)) { setErroGlobal("Use JPEG, PNG ou WebP."); return; }
      if (arquivo.size > 5 * 1024 * 1024) { setErroGlobal("Imagem máx. 5 MB."); return; }
    }
    setErroGlobal("");
    setForm((prev) => ({ ...prev, foto: arquivo }));
  }

  function handleGeneroMusicalChange(e) {
    const selecionados = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setErros((prev) => ({ ...prev, generos_musicais: undefined }));
    setForm((prev) => ({ ...prev, generos_musicais: selecionados }));
  }

  // ── CEP ───────────────────────────────────────────────────────────────────
 async function handleCepBlur() {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
 
    setStatusCep(null);
    setBuscandoCep(true);
    setMsgCep("Buscando…");
 
    try {
      const dados = await buscarCep(cepLimpo);
 
      if (dados.erro) {
        setStatusCep("erro");
        setMsgCep("CEP não encontrado.");
        return;
      }
 
      const enderecoTexto = [dados.logradouro, dados.localidade, dados.uf, "Brasil"]
        .filter(Boolean)
        .join(", ");
 
      let latitude  = null;
      let longitude = null;
 
      try {
        const coord = await buscarLatLong(enderecoTexto);
        if (coord) {
          latitude  = coord.lat;
          longitude = coord.lng;
        }
      } catch {

      }

      setForm((prev) => ({
        ...prev,
        logradouro:  dados.logradouro  || "",
        bairro:      dados.bairro      || "",
        cidade:      dados.localidade  || "",
        estado:      dados.uf          || "",
        complemento: dados.complemento || "",
        latitude,
        longitude,
      }));
 
      setStatusCep("ok");
      setMsgCep("Endereço preenchido automaticamente.");
 
    } catch {
      setStatusCep("erro");
      setMsgCep("Erro ao buscar CEP.");
    } finally {
      setBuscandoCep(false);
    }
  }

  // ── Redes sociais ─────────────────────────────────────────────────────────
  function adicionarRedeSocial() {
    setRedesSociais((prev) => [...prev, { tipo_id: "", link: "" }]);
  }
  function handleRedeSocialChange(index, field, value) {
    setRedesSociais((prev) => prev.map((rs, i) => i === index ? { ...rs, [field]: value } : rs));
  }
  function removerRedeSocial(index) {
    setRedesSociais((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Navegação de steps ────────────────────────────────────────────────────
  function avancar() {
    // Pula step "Artístico" se não for artista
    const proximoStep = stepAtual + 1;
    const pularArtistico = proximoStep === 1 && form.tipo_usuario !== "artista";

    const formComRedes = { ...form, _redesSociais: redesSociais };
    const errosStep = validarStep(stepAtual, formComRedes);

    if (Object.keys(errosStep).length > 0) { setErros(errosStep); return; }

    setStepsOk((prev) => prev.includes(stepAtual) ? prev : [...prev, stepAtual]);
    setErros({});
    setStepAtual(pularArtistico ? proximoStep + 1 : proximoStep);
  }

  function voltar() {
    const stepAnterior = stepAtual - 1;
    const pularArtistico = stepAnterior === 1 && form.tipo_usuario !== "artista";
    setErros({});
    setStepAtual(pularArtistico ? stepAnterior - 1 : stepAnterior);
  }

  function irParaStep(i) {
    if (stepsOk.includes(i)) { setErros({}); setStepAtual(i); }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const formComRedes = { ...form, _redesSociais: redesSociais };
    const errosStep = validarStep(stepAtual, formComRedes);
    if (Object.keys(errosStep).length > 0) { setErros(errosStep); return; }

    setErroGlobal("");
    let dataFormatada = form.data_nasc;
    if (form.data_nasc.includes("/")) {
      const [dia, mes, ano] = form.data_nasc.split("/");
      if (!dia || !mes || !ano) { setErroGlobal("Data de nascimento inválida."); return; }
      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    try {
      setCarregando(true);
      const usuario = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cpf: form.cpf.replace(/\D/g, ""),
        telefone: form.telefone.replace(/\D/g, ""),
        cep: form.cep.replace(/\D/g, ""),
        data_nasc: dataFormatada,
        nacionalidade_id: Number(form.nacionalidade_id),
        genero_id: Number(form.genero_id),
        tipo_usuario: form.tipo_usuario,
        nome_artistico: form.nome_artistico,
        descricao: form.descricao,
        generos_musicais: form.generos_musicais,
        cidade: form.cidade,
        estado: form.estado,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,
      };

      const resp = await cadastrarUsuario(usuario, form.foto || null);
      if (resp.status_code !== 201) {
        setErroGlobal(traduzirErroCadastro(resp.message));
        return;
      }

      const usuarioId = resp.response?.id_usuario;
      if (usuarioId && redesSociais.length > 0) {
        const cadastros = redesSociais.map((rs) =>
          cadastrarRedeSocial({ link: rs.link, tipo_id: Number(rs.tipo_id), usuario_id: usuarioId })
            .catch((err) => console.warn("Falha rede social:", err.message))
        );
        await Promise.allSettled(cadastros);
      }

      setSucesso(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setErroGlobal(traduzirErroCadastro(err.message));
    } finally {
      setCarregando(false);
    }
  }

  // ── Helper: classe de campo ───────────────────────────────────────────────
  const classCampo = (campo) => {
    if (erros[campo]) return "cadastro-sonara-campo campo--erro";
    if (form[campo]) return "cadastro-sonara-campo campo--ok";
    return "cadastro-sonara-campo";
  };

  // Últimos steps visíveis no stepper (condicionalmente exibe "Artístico")
  const stepsVisiveis = form.tipo_usuario === "artista"
    ? STEPS
    : STEPS.filter((s) => s !== "Artístico");

  // Índice real ↔ índice no stepper visual
  const stepRealParaVisivel = (real) => {
    if (form.tipo_usuario !== "artista" && real >= 2) return real - 1;
    return real;
  };

  return (
    <div className="cadastro-sonara-container">
      <header className="header-cadastro">
        <img src={logo} alt="Logo Sonara" />
        <p className="nome-cadastro">Cadastro</p>
      </header>

      <main style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <form
          className="cadastro-sonara-form"
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
        >
          {/* ── STEPPER ── */}
          <div className="cadastro-stepper" role="list">
            {stepsVisiveis.map((label, vi) => {
              const realIdx = form.tipo_usuario === "artista" ? vi : (vi >= 1 ? vi + 1 : vi);
              const ativo = stepAtual === realIdx;
              const concluido = stepsOk.includes(realIdx);
              return (
                <>
                  <div
                    key={label}
                    role="listitem"
                    className={[
                      "cadastro-step",
                      ativo ? "cadastro-step--ativo" : "",
                      concluido ? "cadastro-step--concluido" : "",
                      concluido ? "cadastro-step--clicavel" : "",
                    ].join(" ").trim()}
                    onClick={() => irParaStep(realIdx)}
                    title={concluido ? `Voltar para ${label}` : undefined}
                  >
                    <div className="cadastro-step__num">
                      {concluido ? "✓" : vi + 1}
                    </div>
                    <span className="cadastro-step__label">{label}</span>
                  </div>
                  {vi < stepsVisiveis.length - 1 && (
                    <div className="cadastro-step__line" />
                  )}
                </>
              );
            })}
          </div>

          {/*step dados pessoais*/}
          {stepAtual === 0 && (
            <div className="cadastro-step-painel">
              <p className="cadastro-sonara-secao-titulo">Identificação</p>

              <div className="cadastro-sonara-grid">
                <div className={classCampo("nome")}>
                  <label htmlFor="nome">Nome Completo *</label>
                  <input type="text" id="nome" placeholder="Seu nome completo"
                    value={form.nome} onChange={handleChange} />
                  {erros.nome && <span className="campo-mensagem-erro">{erros.nome}</span>}
                </div>

                <div className={classCampo("cpf")}>
                  <label htmlFor="cpf">CPF *</label>
                  <input type="text" id="cpf" placeholder="000.000.000-00"
                    maxLength="14" value={form.cpf} onChange={handleChange} />
                  {erros.cpf && <span className="campo-mensagem-erro">{erros.cpf}</span>}
                </div>

                <div className={classCampo("data_nasc")}>
                  <label htmlFor="data_nasc">Data de Nascimento *</label>
                  <input type="text" id="data_nasc" placeholder="dd/mm/aaaa"
                    maxLength="10" value={form.data_nasc} onChange={handleChange} />
                  {erros.data_nasc && <span className="campo-mensagem-erro">{erros.data_nasc}</span>}
                </div>
              </div>

              <p className="cadastro-sonara-secao-titulo" style={{ marginTop: "0.5rem" }}>Contato</p>

              <div className="cadastro-sonara-grid">
                <div className={classCampo("email")}>
                  <label htmlFor="email">E-mail *</label>
                  <input type="email" id="email" placeholder="seu@email.com"
                    value={form.email} onChange={handleChange} />
                  {erros.email && <span className="campo-mensagem-erro">{erros.email}</span>}
                </div>

                <div className={classCampo("confirm-email")}>
                  <label htmlFor="confirm-email">Confirmar E-mail *</label>
                  <input type="email" id="confirm-email" placeholder="Repita o e-mail"
                    value={form["confirm-email"]} onChange={handleChange} />
                  {erros["confirm-email"] && <span className="campo-mensagem-erro">{erros["confirm-email"]}</span>}
                </div>

                <div className={classCampo("telefone")}>
                  <label htmlFor="telefone">Telefone</label>
                  <input type="tel" id="telefone" placeholder="(00) 00000-0000"
                    maxLength="15" value={form.telefone} onChange={handleChange} />
                </div>
              </div>

              <p className="cadastro-sonara-secao-titulo" style={{ marginTop: "0.5rem" }}>Acesso</p>

              <div className="cadastro-sonara-grid">
                <div className={classCampo("senha")}>
                  <label htmlFor="senha">Senha *</label>
                  <input type="password" id="senha"
                    placeholder="Mín. 8 chars, maiúscula, número e especial"
                    value={form.senha} onChange={handleChange} />
                  {erros.senha && <span className="campo-mensagem-erro">{erros.senha}</span>}
                </div>

                <div className={classCampo("confirm-senha")}>
                  <label htmlFor="confirm-senha">Confirmar Senha *</label>
                  <input type="password" id="confirm-senha" placeholder="Repita a senha"
                    value={form["confirm-senha"]} onChange={handleChange} />
                  {erros["confirm-senha"] && <span className="campo-mensagem-erro">{erros["confirm-senha"]}</span>}
                </div>
              </div>

              <p className="cadastro-sonara-secao-titulo" style={{ marginTop: "0.5rem" }}>Perfil</p>

              <div className="cadastro-sonara-grid">
                <div className={classCampo("genero_id")}>
                  <label htmlFor="genero_id">Gênero *</label>
                  <div className="select-wrapper">
                    <select id="genero_id" value={form.genero_id} onChange={handleChange}>
                      <option value="">Selecione…</option>
                      {generos.map((g) => (
                        <option key={g.id_genero} value={g.id_genero}>{g.nome}</option>
                      ))}
                    </select>
                  </div>
                  {erros.genero_id && <span className="campo-mensagem-erro">{erros.genero_id}</span>}
                </div>

                <div className={classCampo("nacionalidade_id")}>
                  <label htmlFor="nacionalidade_id">Nacionalidade *</label>
                  <div className="select-wrapper">
                    <select id="nacionalidade_id" value={form.nacionalidade_id} onChange={handleChange}>
                      <option value="">Selecione…</option>
                      {nacionalidades.map((n) => (
                        <option key={n.id_nacionalidade} value={n.id_nacionalidade}>{n.nome}</option>
                      ))}
                    </select>
                  </div>
                  {erros.nacionalidade_id && <span className="campo-mensagem-erro">{erros.nacionalidade_id}</span>}
                </div>

                <div className={classCampo("tipo_usuario")}>
                  <label htmlFor="tipo_usuario">Tipo de Usuário *</label>
                  <div className="select-wrapper">
                    <select id="tipo_usuario" value={form.tipo_usuario} onChange={handleChange}>
                      <option value="">Selecione…</option>
                      <option value="artista">Artista</option>
                      <option value="organizador">Organizador</option>
                      <option value="user">Usuário</option>
                    </select>
                  </div>
                  {erros.tipo_usuario && <span className="campo-mensagem-erro">{erros.tipo_usuario}</span>}
                </div>
              </div>

              <div className="cadastro-sonara-grid cadastro-sonara-grid--full">
                <div className="cadastro-sonara-campo">
                  <label htmlFor="foto">Foto de perfil (opcional, máx. 5 MB)</label>
                  <input type="file" id="foto" accept="image/jpeg,image/png,image/webp"
                    onChange={handleFotoChange} />
                </div>
              </div>
            </div>
          )}

          {/*step dados artista*/}
          {stepAtual === 1 && form.tipo_usuario === "artista" && (
            <div className="cadastro-step-painel">
              <p className="cadastro-sonara-secao-titulo">Identidade Artística</p>

              <div className="cadastro-sonara-grid cadastro-sonara-grid--2">
                <div className={classCampo("nome_artistico")}>
                  <label htmlFor="nome_artistico">Nome Artístico *</label>
                  <input type="text" id="nome_artistico" placeholder="Seu nome no palco"
                    value={form.nome_artistico} onChange={handleChange} />
                  {erros.nome_artistico && <span className="campo-mensagem-erro">{erros.nome_artistico}</span>}
                </div>

                <div className="cadastro-sonara-campo">
                  <label htmlFor="descricao">Descrição</label>
                  <input type="text" id="descricao" placeholder="Fale sobre você"
                    value={form.descricao} onChange={handleChange} />
                </div>
              </div>

              <div className="cadastro-sonara-grid cadastro-sonara-grid--full">
                <div className={erros.generos_musicais ? "cadastro-sonara-campo campo--erro" : "cadastro-sonara-campo"}>
                  <label htmlFor="generos_musicais">Gêneros Musicais *</label>
                  <div className="select-wrapper select-wrapper--multiple">
                    <select id="generos_musicais" multiple
                      value={form.generos_musicais} onChange={handleGeneroMusicalChange}>
                      {generosMusical.map((g) => (
                        <option key={g.id_genero_musical} value={g.id_genero_musical}>{g.nome}</option>
                      ))}
                    </select>
                  </div>
                  <small>Segure Ctrl (ou Cmd) para selecionar mais de um.</small>
                  {erros.generos_musicais && <span className="campo-mensagem-erro">{erros.generos_musicais}</span>}
                </div>
              </div>
            </div>
          )}

          {/* step endereco */}
          {stepAtual === 2 && (
            <div className="cadastro-step-painel">
              <p className="cadastro-sonara-secao-titulo">Localização</p>

              <div className="cadastro-sonara-grid">
                <div className={`cadastro-sonara-campo${statusCep === "erro" ? " campo--erro" : statusCep === "ok" ? " campo--ok" : ""}`}>
                  <label htmlFor="cep">CEP *</label>
                  <input type="text" id="cep" placeholder="00000-000"
                    maxLength="9" value={form.cep}
                    onChange={handleChange} onBlur={handleCepBlur} />
                  {msgCep && (
                    <span className={`cep-hint cep-hint--${buscandoCep ? "buscando" : statusCep}`}>
                      {msgCep}
                    </span>
                  )}
                  {erros.cep && <span className="campo-mensagem-erro">{erros.cep}</span>}
                </div>

                <div className={classCampo("logradouro")} style={{ gridColumn: "span 2" }}>
                  <label htmlFor="logradouro">Rua / Avenida *</label>
                  <input type="text" id="logradouro" placeholder="Nome da rua"
                    value={form.logradouro} onChange={handleChange} />
                  {erros.logradouro && <span className="campo-mensagem-erro">{erros.logradouro}</span>}
                </div>
              </div>

              <div className="cadastro-sonara-grid">
                <div className={classCampo("numero")}>
                  <label htmlFor="numero">Número *</label>
                  <input type="text" id="numero" maxLength="10"
                    value={form.numero} onChange={handleChange} />
                  {erros.numero && <span className="campo-mensagem-erro">{erros.numero}</span>}
                </div>

                <div className="cadastro-sonara-campo">
                  <label htmlFor="complemento">Complemento</label>
                  <input type="text" id="complemento" placeholder="Sala, bloco… (opcional)"
                    maxLength="100" value={form.complemento} onChange={handleChange} />
                </div>

                <div className={classCampo("bairro")}>
                  <label htmlFor="bairro">Bairro *</label>
                  <input type="text" id="bairro"
                    value={form.bairro} onChange={handleChange} />
                  {erros.bairro && <span className="campo-mensagem-erro">{erros.bairro}</span>}
                </div>
              </div>

              <div className="cadastro-sonara-grid cadastro-sonara-grid--2">
                <div className={classCampo("cidade")}>
                  <label htmlFor="cidade">Cidade *</label>
                  <input type="text" id="cidade"
                    value={form.cidade} onChange={handleChange} />
                  {erros.cidade && <span className="campo-mensagem-erro">{erros.cidade}</span>}
                </div>

                <div className={classCampo("estado")}>
                  <label htmlFor="estado">UF *</label>
                  <input type="text" id="estado" maxLength="2" placeholder="SP"
                    value={form.estado} onChange={handleChange} />
                  {erros.estado && <span className="campo-mensagem-erro">{erros.estado}</span>}
                </div>
              </div>
            </div>
          )}

          {/* step redes sociais */}
          {stepAtual === 3 && (
            <div className="cadastro-step-painel">
              <p className="cadastro-sonara-secao-titulo">Redes Sociais (opcional)</p>

              {redesSociais.map((rs, index) => (
                <div className="rede-social-row" key={index}>
                  <div className="cadastro-sonara-campo">
                    <label>Plataforma</label>
                    <div className="select-wrapper">
                      <select value={rs.tipo_id}
                        onChange={(e) => handleRedeSocialChange(index, "tipo_id", e.target.value)}>
                        <option value="">Selecione…</option>
                        {tiposRedesSociais.map((tipo) => (
                          <option key={tipo.id_tipo_redes_sociais} value={tipo.id_tipo_redes_sociais}>
                            {tipo.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="cadastro-sonara-campo">
                    <label>Link</label>
                    <input type="url" placeholder="https://…"
                      value={rs.link}
                      onChange={(e) => handleRedeSocialChange(index, "link", e.target.value)} />
                  </div>

                  <button type="button" className="btn-remover"
                    onClick={() => removerRedeSocial(index)} aria-label="Remover rede social">

                  </button>
                </div>
              ))}

              {erros.redesSociais && (
                <span className="campo-mensagem-erro">{erros.redesSociais}</span>
              )}

              <button type="button" className="btn-inline-secundario"
                onClick={adicionarRedeSocial}>
                + Adicionar rede social
              </button>
            </div>
          )}

          {/* ── Mensagens globais ── */}
          {erroGlobal && (
            <div role="alert" className="msg-feedback msg-feedback--erro">{erroGlobal}</div>
          )}
          {sucesso && (
            <div className="msg-feedback msg-feedback--sucesso">
              Cadastro realizado! Redirecionando para o login…
            </div>
          )}

          {/* ── Navegação ── */}
          <div className="cadastro-step-nav">
            <button type="button" className="btn-nav btn-nav--voltar"
              onClick={stepAtual === 0 ? () => navigate("/") : voltar}>
              {stepAtual === 0 ? "Já tenho conta" : "← Voltar"}
            </button>

            {stepAtual <= 3 ? (
              <button type="button" className="btn-nav btn-nav--avancar" onClick={avancar}>
                Próximo →
              </button>
            ) : (
              <button type="submit" className="btn-nav btn-nav--enviar"
                disabled={carregando || sucesso}>
                {carregando ? "Cadastrando…" : "Cadastrar"}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default Cadastro;