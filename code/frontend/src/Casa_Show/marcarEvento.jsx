import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./marcarEvento.css";
import HeaderCasaShow from "./headerCasaShow.jsx";
import FooterSonara from "../Artista/footer.jsx";
import { cadastrarEvento } from "../services/eventoService";
import { buscarCep } from "../services/enderecoService.js";

const API_URL = import.meta.env.VITE_API_URL;

const STEPS = ["Evento", "Horário", "Endereço"];

const FORM_INICIAL = {
  nome: "",
  descricao: "",
  local: "",
  data: "",
  hora_inicio: "",
  hora_fim: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
};

// Validação por step
function validarStep(step, form) {
  const erros = {};
  if (step === 0) {
    if (!form.nome.trim())      erros.nome      = "Nome é obrigatório.";
    if (!form.descricao.trim()) erros.descricao = "Descrição é obrigatória.";
    if (!form.local.trim())     erros.local     = "Local é obrigatório.";
  }
  if (step === 1) {
    if (!form.data)        erros.data        = "Data é obrigatória.";
    if (!form.hora_inicio) erros.hora_inicio = "Hora de início obrigatória.";
    if (!form.hora_fim)    erros.hora_fim    = "Hora de fim obrigatória.";
    if (form.hora_inicio && form.hora_fim && form.hora_fim <= form.hora_inicio)
      erros.hora_fim = "Hora de fim deve ser após o início.";
  }
  if (step === 2) {
    if (!form.cep.replace(/\D/g, "").length === 8) erros.cep = "CEP inválido.";
    if (!form.logradouro.trim()) erros.logradouro = "Rua obrigatória.";
    if (!form.numero.trim())     erros.numero     = "Número obrigatório.";
    if (!form.bairro.trim())     erros.bairro     = "Bairro obrigatório.";
    if (!form.cidade.trim())     erros.cidade     = "Cidade obrigatória.";
    if (!form.estado.trim())     erros.estado     = "Estado obrigatório.";
  }
  return erros;
}

export default function MarcarEvento() {
  const navigate   = useNavigate();
  const usuarioObj = JSON.parse(sessionStorage.getItem("usuario") ?? "null");
  const organizador_id = usuarioObj?.id_usuario ?? null;

  const inputFotoRef = useRef(null);

  const [form, setForm]         = useState(FORM_INICIAL);
  const [erros, setErros]       = useState({});
  const [stepAtual, setStep]    = useState(0);
  const [stepsOk, setStepsOk]   = useState([]);

  const [previews, setPreviews] = useState([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [drag, setDrag]         = useState(false);

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [statusCep, setStatusCep]     = useState(null); // null | "ok" | "erro"
  const [msgCep, setMsgCep]           = useState("");

  const [enviando, setEnviando] = useState(false);
  const [erroGlobal, setErroGlobal]   = useState(null);
  const [sucesso, setSucesso]         = useState(false);

  // ── Campo change ────────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: undefined }));
  }

  // ── CEP ─────────────────────────────────────────────────────────────────────
  async function handleCepBlur() {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
    setStatusCep(null);
    setBuscandoCep(true);
    setMsgCep("Buscando...");
    try {
      const dados = await buscarCep(cepLimpo);
      if (dados.erro) {
        setStatusCep("erro");
        setMsgCep("CEP não encontrado.");
        return;
      }
      setForm(prev => ({
        ...prev,
        logradouro:  dados.logradouro  ?? prev.logradouro,
        complemento: dados.complemento ?? prev.complemento,
        bairro:      dados.bairro      ?? prev.bairro,
        cidade:      dados.localidade  ?? prev.cidade,
        estado:      dados.uf          ?? prev.estado,
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

  // ── Fotos ────────────────────────────────────────────────────────────────────
  function adicionarArquivos(arquivos) {
    const novas = Array.from(arquivos)
      .filter(f => f.type.startsWith("image/"))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        status: "pendente",
        erro: null,
      }));
    setPreviews(prev => [...prev, ...novas]);
  }

  function handleSelecionarFotos(e) {
    adicionarArquivos(e.target.files);
    e.target.value = "";
  }

  function removerPreview(idx, e) {
    e.stopPropagation();
    setPreviews(prev => {
      const nova = prev.filter((_, i) => i !== idx);
      if (fotoAtiva >= nova.length) setFotoAtiva(Math.max(0, nova.length - 1));
      return nova;
    });
  }

  // Drag & drop
  const onDragOver  = useCallback(e => { e.preventDefault(); setDrag(true);  }, []);
  const onDragLeave = useCallback(()  => setDrag(false), []);
  const onDrop      = useCallback(e   => {
    e.preventDefault();
    setDrag(false);
    adicionarArquivos(e.dataTransfer.files);
  }, []);

  // ── Navegação de steps ────────────────────────────────────────────────────────
  function avancar() {
    const errosStep = validarStep(stepAtual, form);
    if (Object.keys(errosStep).length > 0) {
      setErros(errosStep);
      return;
    }
    setStepsOk(prev => prev.includes(stepAtual) ? prev : [...prev, stepAtual]);
    setStep(s => s + 1);
  }

  function voltar() {
    setStep(s => s - 1);
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errosStep = validarStep(stepAtual, form);
    if (Object.keys(errosStep).length > 0) { setErros(errosStep); return; }

    setErroGlobal(null);
    if (!organizador_id) { setErroGlobal("Você precisa estar logado."); return; }

    setEnviando(true);
    try {
      const json     = await cadastrarEvento({ ...form, organizador_id });
      const idCriado = json?.response?.evento?.id_evento ?? null;

      if (idCriado && previews.length > 0) {
        const snapshot = [...previews];
        for (let i = 0; i < snapshot.length; i++) {
          if (snapshot[i].status !== "pendente") continue;
          setPreviews(prev => prev.map((p, idx) =>
            idx === i ? { ...p, status: "enviando" } : p));
          try {
            const fd = new FormData();
            fd.append("foto", snapshot[i].file);
            fd.append("evento_id", String(idCriado));
            const res = await fetch(`${API_URL}/foto`, { method: "POST", body: fd });
            const fj  = await res.json();
            setPreviews(prev => prev.map((p, idx) =>
              idx === i ? {
                ...p,
                status: res.ok ? "ok" : "erro",
                erro:   res.ok ? null : (fj.message ?? "Erro ao enviar"),
              } : p));
          } catch (err) {
            setPreviews(prev => prev.map((p, idx) =>
              idx === i ? { ...p, status: "erro", erro: err.message } : p));
          }
        }
      }

      setSucesso(true);
      setTimeout(() => navigate("/casaShow"), 1800);
    } catch (err) {
      setErroGlobal(err.message);
    } finally {
      setEnviando(false);
    }
  }

  const fotoPrincipalUrl = previews[fotoAtiva]?.url ?? null;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="pagina">
      <HeaderCasaShow />

      <main className="main">
        <section className="card-evento">

          {/* ── GALERIA ── */}
          <div className="galeria">
            <div
              className={`upload-zone${drag ? " upload-zone--drag" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputFotoRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Clique ou arraste fotos aqui"
              onKeyDown={e => e.key === "Enter" && inputFotoRef.current?.click()}
            >
              {fotoPrincipalUrl ? (
                <>
                  <img className="foto-principal" src={fotoPrincipalUrl} alt="Foto principal" />
                  <div className="upload-zone__overlay">
                    <span className="upload-zone__icon">📷</span>
                    <span className="upload-zone__label upload-zone__label--sobre">Trocar foto</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="upload-zone__icon">📷</span>
                  <span className="upload-zone__label">
                    {drag ? "Solte aqui!" : "Arraste ou clique para adicionar fotos"}
                  </span>
                </>
              )}
            </div>

            <input
              ref={inputFotoRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              style={{ display: "none" }}
              onChange={handleSelecionarFotos}
            />

            {previews.length > 0 && (
              <div className="preview-grid">
                {previews.map((item, i) => (
                  <div
                    key={item.id}
                    className={`preview-item${i === fotoAtiva ? " preview-item--ativa" : ""}`}
                    onClick={() => setFotoAtiva(i)}
                  >
                    <img src={item.url} alt={`preview ${i + 1}`} />

                    {item.status === "enviando" && (
                      <div className="preview-overlay"><span className="spinner" /></div>
                    )}
                    {item.status === "ok" && (
                      <div className="preview-overlay overlay-ok">✓</div>
                    )}
                    {item.status === "erro" && (
                      <div className="preview-overlay overlay-erro" title={item.erro}>✗</div>
                    )}
                    {item.status === "pendente" && (
                      <button
                        className="btn-remover-foto"
                        type="button"
                        onClick={e => removerPreview(i, e)}
                        aria-label="Remover foto"
                      >×</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {previews.length > 0 && (
              <button
                type="button"
                className="btn-adicionar-fotos"
                onClick={() => inputFotoRef.current?.click()}
              >
                + Adicionar mais fotos
              </button>
            )}
          </div>

          {/* ── FORMULÁRIO ── */}
          <form className="formulario" onSubmit={handleSubmit} noValidate>

            {/* Stepper */}
            <div className="stepper" role="list">
              {STEPS.map((label, i) => {
                const concluido = stepsOk.includes(i);
                const ativo     = i === stepAtual;
                return (
                  <>
                    <div
                      key={label}
                      role="listitem"
                      className={`step${ativo ? " step--ativo" : ""}${concluido ? " step--concluido" : ""}`}
                      onClick={() => concluido && setStep(i)}
                      title={concluido ? `Voltar para ${label}` : undefined}
                    >
                      <div className="step__num">
                        {concluido ? "✓" : i + 1}
                      </div>
                      <span className="step__label">{label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className="step__line" />}
                  </>
                );
              })}
            </div>

            {/* ── STEP 0: EVENTO ── */}
            {stepAtual === 0 && (
              <div className="step-painel">
                <div className="campo-grupo">
                  <label htmlFor="nome">Nome do evento</label>
                  <input
                    id="nome" name="nome" type="text"
                    className={`me-input${erros.nome ? " me-input--erro" : form.nome ? " me-input--ok" : ""}`}
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Ex: Noite de Jazz no Mirante"
                    maxLength={100}
                  />
                  <div className="campo-footer">
                    {erros.nome && <span className="campo-erro">{erros.nome}</span>}
                    <span className="campo-conta">{form.nome.length}/100</span>
                  </div>
                </div>

                <div className="campo-grupo">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao" name="descricao"
                    className={`me-textarea${erros.descricao ? " me-input--erro" : ""}`}
                    value={form.descricao}
                    onChange={handleChange}
                    placeholder="Conte sobre o evento, atrações, estilo musical..."
                    maxLength={500}
                  />
                  <div className="campo-footer">
                    {erros.descricao && <span className="campo-erro">{erros.descricao}</span>}
                    <span className="campo-conta">{form.descricao.length}/500</span>
                  </div>
                </div>

                <div className="campo-grupo">
                  <label htmlFor="local">Local / Nome do espaço</label>
                  <input
                    id="local" name="local" type="text"
                    className={`me-input${erros.local ? " me-input--erro" : form.local ? " me-input--ok" : ""}`}
                    value={form.local}
                    onChange={handleChange}
                    placeholder="Ex: Clube dos Artistas"
                    maxLength={255}
                  />
                  {erros.local && <span className="campo-erro">{erros.local}</span>}
                </div>
              </div>
            )}

            {/* ── STEP 1: HORÁRIO ── */}
            {stepAtual === 1 && (
              <div className="step-painel">
                <div className="campo-grupo">
                  <label htmlFor="data">Data do evento</label>
                  <input
                    id="data" name="data" type="date"
                    className={`me-input${erros.data ? " me-input--erro" : form.data ? " me-input--ok" : ""}`}
                    value={form.data}
                    onChange={handleChange}
                  />
                  {erros.data && <span className="campo-erro">{erros.data}</span>}
                </div>

                <div className="campos-grid">
                  <div className="campo-grupo">
                    <label htmlFor="hora_inicio">Hora de início</label>
                    <input
                      id="hora_inicio" name="hora_inicio" type="time"
                      className={`me-input${erros.hora_inicio ? " me-input--erro" : form.hora_inicio ? " me-input--ok" : ""}`}
                      value={form.hora_inicio}
                      onChange={handleChange}
                    />
                    {erros.hora_inicio && <span className="campo-erro">{erros.hora_inicio}</span>}
                  </div>

                  <div className="campo-grupo">
                    <label htmlFor="hora_fim">Hora de fim</label>
                    <input
                      id="hora_fim" name="hora_fim" type="time"
                      className={`me-input${erros.hora_fim ? " me-input--erro" : form.hora_fim ? " me-input--ok" : ""}`}
                      value={form.hora_fim}
                      onChange={handleChange}
                    />
                    {erros.hora_fim && <span className="campo-erro">{erros.hora_fim}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: ENDEREÇO ── */}
            {stepAtual === 2 && (
              <div className="step-painel">
                <div className="campo-grupo">
                  <label htmlFor="cep">CEP</label>
                  <input
                    id="cep" name="cep" type="text"
                    className={`me-input${statusCep === "erro" ? " me-input--erro" : statusCep === "ok" ? " me-input--ok" : ""}`}
                    value={form.cep}
                    onChange={handleChange}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {msgCep && (
                    <span className={`cep-hint cep-hint--${buscandoCep ? "buscando" : statusCep}`}>
                      {msgCep}
                    </span>
                  )}
                </div>

                <div className="campos-grid">
                  <div className="campo-grupo" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="logradouro">Rua / Avenida</label>
                    <input
                      id="logradouro" name="logradouro" type="text"
                      className={`me-input${erros.logradouro ? " me-input--erro" : form.logradouro ? " me-input--ok" : ""}`}
                      value={form.logradouro}
                      onChange={handleChange}
                      placeholder="Nome da rua"
                      maxLength={255}
                    />
                    {erros.logradouro && <span className="campo-erro">{erros.logradouro}</span>}
                  </div>

                  <div className="campo-grupo">
                    <label htmlFor="numero">Número</label>
                    <input
                      id="numero" name="numero" type="text"
                      className={`me-input${erros.numero ? " me-input--erro" : form.numero ? " me-input--ok" : ""}`}
                      value={form.numero}
                      onChange={handleChange}
                      placeholder="123"
                    />
                    {erros.numero && <span className="campo-erro">{erros.numero}</span>}
                  </div>

                  <div className="campo-grupo">
                    <label htmlFor="complemento">Complemento</label>
                    <input
                      id="complemento" name="complemento" type="text"
                      className="me-input"
                      value={form.complemento}
                      onChange={handleChange}
                      placeholder="Sala, bloco... (opcional)"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="campos-grid campos-grid--3">
                  <div className="campo-grupo">
                    <label htmlFor="bairro">Bairro</label>
                    <input
                      id="bairro" name="bairro" type="text"
                      className={`me-input${erros.bairro ? " me-input--erro" : form.bairro ? " me-input--ok" : ""}`}
                      value={form.bairro}
                      onChange={handleChange}
                      placeholder="Bairro"
                      maxLength={100}
                    />
                    {erros.bairro && <span className="campo-erro">{erros.bairro}</span>}
                  </div>

                  <div className="campo-grupo">
                    <label htmlFor="cidade">Cidade</label>
                    <input
                      id="cidade" name="cidade" type="text"
                      className={`me-input${erros.cidade ? " me-input--erro" : form.cidade ? " me-input--ok" : ""}`}
                      value={form.cidade}
                      onChange={handleChange}
                      placeholder="Cidade"
                      maxLength={170}
                    />
                    {erros.cidade && <span className="campo-erro">{erros.cidade}</span>}
                  </div>

                  <div className="campo-grupo">
                    <label htmlFor="estado">UF</label>
                    <input
                      id="estado" name="estado" type="text"
                      className={`me-input${erros.estado ? " me-input--erro" : form.estado ? " me-input--ok" : ""}`}
                      value={form.estado}
                      onChange={handleChange}
                      placeholder="SP"
                      maxLength={2}
                    />
                    {erros.estado && <span className="campo-erro">{erros.estado}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Feedback global */}
            {erroGlobal && (
              <div className="msg-feedback msg-feedback--erro">{erroGlobal}</div>
            )}
            {sucesso && (
              <div className="msg-feedback msg-feedback--sucesso">
                Evento criado com sucesso! Redirecionando...
              </div>
            )}

            {/* Navegação */}
            <div className="step-nav">
              <button
                type="button"
                className="btn-nav btn-nav--voltar"
                onClick={voltar}
                disabled={stepAtual === 0}
              >
                ← Voltar
              </button>

              {stepAtual < STEPS.length - 1 ? (
                <button
                  type="button"
                  className="btn-nav btn-nav--avancar"
                  onClick={avancar}
                >
                  Próximo →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-nav btn-nav--enviar"
                  disabled={enviando || sucesso}
                >
                  {enviando ? "Enviando..." : "Marcar Evento"}
                </button>
              )}
            </div>
          </form>
        </section>
      </main>

      <FooterSonara />
    </div>
  );
}