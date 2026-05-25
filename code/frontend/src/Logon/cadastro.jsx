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

// ─── Mapeia mensagens de erro do backend para português claro ──────────────────
function traduzirErroCadastro(mensagem) {
  if (!mensagem) return "Ocorreu um erro inesperado. Tente novamente.";

  const mapa = {
    "já está cadastrado":           mensagem, // já é clara, repassa
    "E-mail":                       mensagem,
    "CPF":                          mensagem,
    "nome artístico":               mensagem,
    "gênero musical":               mensagem,
    "senha deve ter":               mensagem,
    "formato do e-mail":            mensagem,
    "endereço":                     mensagem,
    "tipo_usuario":                 mensagem,
    "500":  "Erro interno no servidor. Tente novamente em alguns minutos.",
    "502":  "Serviço de armazenamento de imagens indisponível. O cadastro foi realizado sem a foto.",
    "conexão": "Não foi possível conectar ao servidor. Verifique sua internet.",
  };

  for (const [chave, valor] of Object.entries(mapa)) {
    if (mensagem.includes(chave)) return valor;
  }

  return mensagem;
}

function Cadastro() {
  const navigate = useNavigate();

  const [erro, setErro]           = useState("");
  const [sucesso, setSucesso]     = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep]     = useState("");

  const [generos, setGeneros]                   = useState([]);
  const [nacionalidades, setNacionalidades]     = useState([]);
  const [generosMusical, setGenerosMusical]     = useState([]);
  const [tiposRedesSociais, setTiposRedesSociais] = useState([]);
  const [redesSociais, setRedesSociais]         = useState([]);

  const [errosCampos, setErrosCampos] = useState({});

  const [form, setForm] = useState({
    nome: "",
    email: "",
    "confirm-email": "",
    senha: "",
    "confirm-senha": "",
    cpf: "",
    data_nasc: "",
    nacionalidade_id: "",
    genero_id: "",
    telefone: "",
    tipo_usuario: "",
    nome_artistico: "",
    descricao: "",
    generos_musicais: [],
    cep: "",
    cidade: "",
    estado: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    foto: null,
  });

  useEffect(() => {
    buscarGeneros()
      .then((data) => setGeneros(data.response?.generos ?? []))
      .catch(() => setErro("Erro ao carregar gêneros. Recarregue a página."));

    buscarNacionalidades()
      .then((data) => setNacionalidades(data.response?.nacionalidades ?? []))
      .catch(() => setErro("Erro ao carregar nacionalidades. Recarregue a página."));

    buscarGeneroMusical()
      .then((data) => setGenerosMusical(data.response?.GeneroMusical ?? []))
      .catch(() => setErro("Erro ao carregar gêneros musicais. Recarregue a página."));

    buscarTiposRedesSociais()
      .then((data) => setTiposRedesSociais(data.response?.TipoRedesSociais ?? []))
      .catch(() => setErro("Erro ao carregar tipos de redes sociais. Recarregue a página."));
  }, []);

  function handleChange(e) {
    setErro("");
    const { id, value } = e.target;
    setErrosCampos((prev) => ({ ...prev, [id]: "" }));
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  function handleFotoChange(e) {
    setErro("");
    const arquivo = e.target.files[0] || null;

    if (arquivo) {
      const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
      if (!tiposPermitidos.includes(arquivo.type)) {
        setErro("Formato de imagem inválido. Use JPEG, PNG ou WebP.");
        return;
      }
      if (arquivo.size > 5 * 1024 * 1024) {
        setErro("A imagem deve ter no máximo 5MB.");
        return;
      }
    }

    setForm((prev) => ({ ...prev, foto: arquivo }));
  }

  function handleGeneroMusicalChange(e) {
    const selecionados = Array.from(e.target.selectedOptions).map((opt) =>
      Number(opt.value)
    );
    setForm((prev) => ({ ...prev, generos_musicais: selecionados }));
  }

  function adicionarRedeSocial() {
    setRedesSociais((prev) => [...prev, { tipo_id: "", link: "" }]);
  }

  function handleRedeSocialChange(index, field, value) {
    setRedesSociais((prev) =>
      prev.map((rs, i) => (i === index ? { ...rs, [field]: value } : rs))
    );
  }

  function removerRedeSocial(index) {
    setRedesSociais((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCepBlur() {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    setErroCep("");
    setBuscandoCep(true);

    try {
      const dados = await buscarCep(cepLimpo);

      if (dados.erro) {
        setErroCep("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }

      // Busca lat/long em paralelo sem bloquear o preenchimento do formulário
      buscarLatLong(`${dados.logradouro}, ${dados.localidade}, ${dados.uf}, Brasil`)
        .then((coordenadas) => {
          if (coordenadas) {
            setForm((prev) => ({
              ...prev,
              latitude:  coordenadas.lat,
              longitude: coordenadas.lng,
            }));
          }
        })
        .catch(() => {}); // silencia erro de geolocalização

      setForm((prev) => ({
        ...prev,
        logradouro:  dados.logradouro  || "",
        bairro:      dados.bairro      || "",
        cidade:      dados.localidade  || "",
        estado:      dados.uf          || "",
        complemento: dados.complemento || "",
      }));
    } catch {
      setErroCep("Erro ao buscar CEP. Preencha o endereço manualmente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function validarFormulario() {
    const erros = {};

    if (!form.nome.trim())
      erros.nome = "Nome completo é obrigatório.";

    if (!form.email.trim())
      erros.email = "E-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      erros.email = "Informe um e-mail válido.";

    if (form.email !== form["confirm-email"])
      erros["confirm-email"] = "Os e-mails não coincidem.";

    if (!form.senha)
      erros.senha = "Senha é obrigatória.";
    else if (form.senha.length < 8)
      erros.senha = "A senha deve ter pelo menos 8 caracteres.";
    else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(form.senha))
      erros.senha = "A senha deve ter: letra maiúscula, número e caractere especial (!@#$%^&*).";

    if (form.senha !== form["confirm-senha"])
      erros["confirm-senha"] = "As senhas não coincidem.";

    if (!form.cpf.trim())
      erros.cpf = "CPF é obrigatório.";

    if (!form.data_nasc)
      erros.data_nasc = "Data de nascimento é obrigatória.";

    if (!form.nacionalidade_id)
      erros.nacionalidade_id = "Selecione uma nacionalidade.";

    if (!form.genero_id)
      erros.genero_id = "Selecione um gênero.";

    if (!form.tipo_usuario)
      erros.tipo_usuario = "Selecione o tipo de usuário.";

    if (form.tipo_usuario === "artista") {
      if (!form.nome_artistico.trim())
        erros.nome_artistico = "Nome artístico é obrigatório para artistas.";
      if (form.generos_musicais.length === 0)
        erros.generos_musicais = "Selecione pelo menos um gênero musical.";
    }

    if (!form.cep.trim())
      erros.cep = "CEP é obrigatório.";
    if (!form.logradouro.trim())
      erros.logradouro = "Rua/logradouro é obrigatório.";
    if (!form.numero.trim())
      erros.numero = "Número é obrigatório.";
    if (!form.bairro.trim())
      erros.bairro = "Bairro é obrigatório.";
    if (!form.cidade.trim())
      erros.cidade = "Cidade é obrigatória.";
    if (!form.estado.trim())
      erros.estado = "Estado é obrigatório.";

    const redesInvalidas = redesSociais.some((rs) => !rs.tipo_id || !rs.link.trim());
    if (redesInvalidas)
      erros.redesSociais = "Preencha a plataforma e o link de todas as redes sociais adicionadas.";

    setErrosCampos(erros);
    return Object.keys(erros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!validarFormulario()) {
      setErro("Corrija os campos destacados antes de continuar.");
      return;
    }

    // Formata data dd/mm/aaaa → aaaa-mm-dd
    let dataFormatada = form.data_nasc;
    if (form.data_nasc.includes("/")) {
      const [dia, mes, ano] = form.data_nasc.split("/");
      if (!dia || !mes || !ano) {
        setErro("Data de nascimento inválida. Use o formato dd/mm/aaaa.");
        return;
      }
      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    try {
      setCarregando(true);

      const usuario = {
        nome:             form.nome,
        email:            form.email,
        senha:            form.senha,
        cpf:              form.cpf.replace(/\D/g, ""),
        telefone:         form.telefone.replace(/\D/g, ""),
        cep:              form.cep.replace(/\D/g, ""),
        data_nasc:        dataFormatada,
        nacionalidade_id: Number(form.nacionalidade_id),
        genero_id:        Number(form.genero_id),
        tipo_usuario:     form.tipo_usuario,
        nome_artistico:   form.nome_artistico,
        descricao:        form.descricao,
        generos_musicais: form.generos_musicais,
        cidade:           form.cidade,
        estado:           form.estado,
        logradouro:       form.logradouro,
        numero:           form.numero,
        complemento:      form.complemento,
        bairro:           form.bairro,
      };

      const respostaUsuario = await cadastrarUsuario(usuario, form.foto || null);

      if (respostaUsuario.status_code !== 201) {
        const mensagemTraduzida = traduzirErroCadastro(respostaUsuario.message);
        setErro(mensagemTraduzida);
        return;
      }

      const usuarioId = respostaUsuario.response?.id_usuario;

      // Cadastra redes sociais (falha silenciosa — não impede o cadastro)
      if (usuarioId && redesSociais.length > 0) {
        const cadastros = redesSociais.map((rs) =>
          cadastrarRedeSocial({
            link:       rs.link,
            tipo_id:    Number(rs.tipo_id),
            usuario_id: usuarioId,
          }).catch((err) => {
            console.warn("Falha ao cadastrar rede social:", err.message);
            return null;
          })
        );
        await Promise.allSettled(cadastros);
      }

      setSucesso(true);
      setTimeout(() => navigate("/login"), 2500);

    } catch (err) {
      setErro(traduzirErroCadastro(err.message));
    } finally {
      setCarregando(false);
    }
  }

  // ─── Utilitário para exibir erro por campo ────────────────────────────────
  const CampoErro = ({ campo }) =>
    errosCampos[campo] ? (
      <span style={{ color: "#ffe0e0", fontSize: "0.78rem", marginTop: "4px" }}>
        {errosCampos[campo]}
      </span>
    ) : null;

  const inputStyle = (campo) =>
    errosCampos[campo] ? { border: "2px solid #ffe0e0" } : {};

  return (
    <div className="cadastro-sonara-container">
      <header className="header-cadastro">
        <img src={logo} alt="Logo Sonara" />
        <p className="nome-cadastro">CADASTRO</p>
      </header>

      <main>
        <form
          className="cadastro-sonara-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {/* DADOS PESSOAIS */}
          <section className="cadastro-sonara-secao">
            <h3>Dados Pessoais</h3>

            <div className="cadastro-sonara-grid">
              <div className="cadastro-sonara-campo">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Digite seu nome completo"
                  value={form.nome}
                  onChange={handleChange}
                  style={inputStyle("nome")}
                  required
                />
                <CampoErro campo="nome" />
              </div>

              <div className="cadastro-sonara-campo">
                <label htmlFor="cpf">CPF *</label>
                <input
                  type="text"
                  id="cpf"
                  placeholder="000.000.000-00"
                  maxLength="14"
                  value={form.cpf}
                  onChange={handleChange}
                  style={inputStyle("cpf")}
                  required
                />
                <CampoErro campo="cpf" />
              </div>

              <div className="cadastro-sonara-campo">
                <label htmlFor="data_nasc">Data de Nascimento *</label>
                <input
                  type="text"
                  id="data_nasc"
                  placeholder="dd/mm/aaaa"
                  maxLength="10"
                  value={form.data_nasc}
                  onChange={handleChange}
                  style={inputStyle("data_nasc")}
                  required
                />
                <CampoErro campo="data_nasc" />
              </div>
            </div>

            <div className="cadastro-sonara-grid">
              <div className="cadastro-sonara-campo">
                <label htmlFor="email">E-mail *</label>
                <input
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle("email")}
                  required
                />
                <CampoErro campo="email" />
              </div>

              <div className="cadastro-sonara-campo">
                <label htmlFor="confirm-email">Confirmar E-mail *</label>
                <input
                  type="email"
                  id="confirm-email"
                  placeholder="Repita o e-mail"
                  value={form["confirm-email"]}
                  onChange={handleChange}
                  style={inputStyle("confirm-email")}
                  required
                />
                <CampoErro campo="confirm-email" />
              </div>

              <div className="cadastro-sonara-campo">
                <label htmlFor="telefone">Telefone *</label>
                <input
                  type="tel"
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  maxLength="15"
                  value={form.telefone}
                  onChange={handleChange}
                  style={inputStyle("telefone")}
                  required
                />
                <CampoErro campo="telefone" />
              </div>
            </div>

            <div className="cadastro-sonara-grid">
              <div className="cadastro-sonara-campo">
                <label htmlFor="senha">Senha *</label>
                <input
                  type="password"
                  id="senha"
                  placeholder="Mín. 8 caracteres, maiúscula, número e especial"
                  value={form.senha}
                  onChange={handleChange}
                  style={inputStyle("senha")}
                  required
                />
                <CampoErro campo="senha" />
              </div>

              <div className="cadastro-sonara-campo">
                <label htmlFor="confirm-senha">Confirmar Senha *</label>
                <input
                  type="password"
                  id="confirm-senha"
                  placeholder="Repita a senha"
                  value={form["confirm-senha"]}
                  onChange={handleChange}
                  style={inputStyle("confirm-senha")}
                  required
                />
                <CampoErro campo="confirm-senha" />
              </div>

              <div className="cadastro-sonara-campo">
                <label htmlFor="genero_id">Gênero *</label>
                <select
                  id="genero_id"
                  value={form.genero_id}
                  onChange={handleChange}
                  style={inputStyle("genero_id")}
                  required
                >
                  <option value="">Selecione...</option>
                  {generos.map((genero) => (
                    <option key={genero.id_genero} value={genero.id_genero}>
                      {genero.nome}
                    </option>
                  ))}
                </select>
                <CampoErro campo="genero_id" />
              </div>
            </div>

            <div className="cadastro-sonara-grid">
              <div className="cadastro-sonara-campo">
                <label htmlFor="nacionalidade_id">Nacionalidade *</label>
                <select
                  id="nacionalidade_id"
                  value={form.nacionalidade_id}
                  onChange={handleChange}
                  style={inputStyle("nacionalidade_id")}
                  required
                >
                  <option value="">Selecione...</option>
                  {nacionalidades.map((n) => (
                    <option key={n.id_nacionalidade} value={n.id_nacionalidade}>
                      {n.nome}
                    </option>
                  ))}
                </select>
                <CampoErro campo="nacionalidade_id" />
              </div>

              <div className="cadastro-sonara-campo">
                <label htmlFor="tipo_usuario">Tipo de Usuário *</label>
                <select
                  id="tipo_usuario"
                  value={form.tipo_usuario}
                  onChange={handleChange}
                  style={inputStyle("tipo_usuario")}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="artista">Artista</option>
                  <option value="organizador">Organizador</option>
                  <option value="user">Usuário</option>
                </select>
                <CampoErro campo="tipo_usuario" />
              </div>

              {form.tipo_usuario === "artista" && (
                <div className="cadastro-sonara-campo">
                  <label htmlFor="generos_musicais">Gêneros Musicais *</label>
                  <select
                    id="generos_musicais"
                    multiple
                    value={form.generos_musicais}
                    onChange={handleGeneroMusicalChange}
                    style={inputStyle("generos_musicais")}
                    required
                  >
                    {generosMusical.map((genero) => (
                      <option key={genero.id_genero_musical} value={genero.id_genero_musical}>
                        {genero.nome}
                      </option>
                    ))}
                  </select>
                  <small>Segure Ctrl para selecionar mais de um</small>
                  <CampoErro campo="generos_musicais" />
                </div>
              )}
            </div>

            {form.tipo_usuario === "artista" && (
              <div className="cadastro-sonara-grid">
                <div className="cadastro-sonara-campo">
                  <label htmlFor="nome_artistico">Nome Artístico *</label>
                  <input
                    type="text"
                    id="nome_artistico"
                    placeholder="Seu nome artístico"
                    value={form.nome_artistico}
                    onChange={handleChange}
                    style={inputStyle("nome_artistico")}
                    required
                  />
                  <CampoErro campo="nome_artistico" />
                </div>

                <div className="cadastro-sonara-campo">
                  <label htmlFor="descricao">Descrição</label>
                  <input
                    type="text"
                    id="descricao"
                    placeholder="Fale sobre você"
                    value={form.descricao}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="cadastro-sonara-grid">
              <div className="cadastro-sonara-campo">
                <label htmlFor="foto">Foto de perfil (opcional, máx. 5MB)</label>
                <input
                  type="file"
                  id="foto"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFotoChange}
                />
              </div>
            </div>
          </section>

          {/* REDES SOCIAIS */}
          <section className="cadastro-sonara-secao">
            <h3>
              Redes Sociais{" "}
              <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>
                (opcional)
              </span>
            </h3>

            {redesSociais.map((rs, index) => (
              <div className="cadastro-sonara-grid" key={index}>
                <div className="cadastro-sonara-campo">
                  <label>Plataforma</label>
                  <select
                    value={rs.tipo_id}
                    onChange={(e) => handleRedeSocialChange(index, "tipo_id", e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {tiposRedesSociais.map((tipo) => (
                      <option key={tipo.id_tipo_redes_sociais} value={tipo.id_tipo_redes_sociais}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cadastro-sonara-campo">
                  <label>Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={rs.link}
                    onChange={(e) => handleRedeSocialChange(index, "link", e.target.value)}
                  />
                </div>

                <div className="cadastro-sonara-campo" style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    type="button"
                    className="cadastro-sonara-btn-secundario"
                    onClick={() => removerRedeSocial(index)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}

            {errosCampos.redesSociais && (
              <span style={{ color: "#ffe0e0", fontSize: "0.78rem" }}>
                {errosCampos.redesSociais}
              </span>
            )}

            <button
              type="button"
              className="cadastro-sonara-btn-secundario"
              onClick={adicionarRedeSocial}
            >
              + Adicionar rede social
            </button>
          </section>

          {/* ENDEREÇO */}
          <section className="cadastro-sonara-endereco">
            <h3>Endereço</h3>

            <div className="cadastro-sonara-endereco-grid">
              <div className="cadastro-sonara-campo cep">
                <label htmlFor="cep">
                  CEP *{" "}
                  {buscandoCep && (
                    <span className="buscando-cep"> Buscando…</span>
                  )}
                </label>
                <input
                  type="text"
                  id="cep"
                  placeholder="00000-000"
                  maxLength="9"
                  value={form.cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  style={inputStyle("cep")}
                  required
                />
                {erroCep && (
                  <span style={{ color: "#ffe0e0", fontSize: "0.78rem" }}>
                    {erroCep}
                  </span>
                )}
                <CampoErro campo="cep" />
              </div>

              <div className="cadastro-sonara-campo rua">
                <label htmlFor="logradouro">Rua *</label>
                <input
                  type="text"
                  id="logradouro"
                  placeholder="Rua, Avenida..."
                  value={form.logradouro}
                  onChange={handleChange}
                  style={inputStyle("logradouro")}
                  required
                />
                <CampoErro campo="logradouro" />
              </div>

              <div className="cadastro-sonara-campo numero">
                <label htmlFor="numero">Nº *</label>
                <input
                  type="text"
                  id="numero"
                  maxLength="10"
                  value={form.numero}
                  onChange={handleChange}
                  style={inputStyle("numero")}
                  required
                />
                <CampoErro campo="numero" />
              </div>

              <div className="cadastro-sonara-campo bairro">
                <label htmlFor="bairro">Bairro *</label>
                <input
                  type="text"
                  id="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                  style={inputStyle("bairro")}
                  required
                />
                <CampoErro campo="bairro" />
              </div>

              <div className="cadastro-sonara-campo cidade">
                <label htmlFor="cidade">Cidade *</label>
                <input
                  type="text"
                  id="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  style={inputStyle("cidade")}
                  required
                />
                <CampoErro campo="cidade" />
              </div>

              <div className="cadastro-sonara-campo uf">
                <label htmlFor="estado">UF *</label>
                <input
                  type="text"
                  id="estado"
                  maxLength="2"
                  value={form.estado}
                  onChange={handleChange}
                  style={inputStyle("estado")}
                  required
                />
                <CampoErro campo="estado" />
              </div>

              <div className="cadastro-sonara-campo complemento">
                <label htmlFor="complemento">Complemento</label>
                <input
                  type="text"
                  id="complemento"
                  maxLength="100"
                  value={form.complemento}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {erro && (
            <p
              role="alert"
              className="cadastro-sonara-erro"
              style={{
                background: "rgba(0,0,0,0.18)",
                borderRadius: "8px",
                padding: "10px 14px",
              }}
            >
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="cadastro-sonara-sucesso">
              Cadastro realizado com sucesso! Redirecionando para o login…
            </p>
          )}

          <div className="cadastro-sonara-botoes">
            <button
              type="button"
              className="cadastro-sonara-btn-secundario"
              onClick={() => navigate("/login")}
            >
              Já tenho conta
            </button>

            <button
              type="submit"
              className="cadastro-sonara-btn-primario"
              disabled={carregando || buscandoCep}
            >
              {carregando ? "Cadastrando…" : "Cadastrar"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Cadastro;