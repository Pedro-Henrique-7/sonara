import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import HeaderCasaShow from "./headerCasaShow.jsx";
import "./sobreEventoCasaShow.css";
import fotoShow from "../img/fotoShow.png";
import FooterSonara from "../Artista/footer.jsx";
import {
  buscarEventosPorId,
  atualizarEvento,
  uploadFotoEvento,
  atualizarFotoEvento,
  deletarFotoEvento,
} from "../services/eventoService";
import { buscarCep } from "../services/enderecoService";

const PLACEHOLDER_IMG = fotoShow;

function formatarDataInput(dataISO) {
  if (!dataISO) return "";
  return new Date(dataISO).toISOString().split("T")[0];
}

export default function SobreEventoCasaShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const fileAddRef   = useRef(null);
  const fotosRef     = useRef([]);
  const fotoAtivaRef = useRef(0);

  const [evento,   setEvento]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [erro,     setErro]     = useState("");
  const [sucesso,  setSucesso]  = useState("");
  const [salvando, setSalvando] = useState(false);

  const [fotos,     setFotos]     = useState([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [drag,      setDrag]      = useState(false);

  // Estrelas (espelha sobreEvento)
  const totalEstrelas = 5;
  const [nota,      setNota]      = useState(0);
  const [hoverNota, setHoverNota] = useState(0);

  const [form, setForm] = useState({
    id_endereco_evento: null,
    nome: "", descricao: "", data: "",
    hora_inicio: "", hora_fim: "", local: "",
    logradouro: "", numero: "", complemento: "",
    bairro: "", cidade: "", estado: "", cep: "",
  });

  useEffect(() => { fotosRef.current    = fotos;     }, [fotos]);
  useEffect(() => { fotoAtivaRef.current = fotoAtiva; }, [fotoAtiva]);
  useEffect(() => { carregarEvento();                  }, [id]);

  async function carregarEvento() {
    try {
      setLoading(true);
      setErro("");
      const json = await buscarEventosPorId(id);
      const ev = json?.response?.evento || json?.response?.Evento || json?.evento || json;
      if (!ev || Object.keys(ev).length === 0) throw new Error("Evento não encontrado.");

      setEvento(ev);

      const fotosBackend = ev.fotos?.length
        ? ev.fotos.map((f) => ({
            id_foto: f.id_foto ?? f.id ?? null,
            evento_id: Number(id),
            url: f.url ?? f.foto ?? "",
            file: null, pendente: false,
          }))
        : ev.url_foto
        ? [{ id_foto: null, evento_id: Number(id), url: ev.url_foto, file: null, pendente: false }]
        : [];

      setFotos(fotosBackend);
      fotosRef.current = fotosBackend;
      setFotoAtiva(0);
      fotoAtivaRef.current = 0;

      const end = ev.endereco || {};
      setForm({
        id_endereco_evento: end.id_endereco_evento || ev.id_endereco_evento || null,
        nome:        ev.nome        || ev.evento_nome || "",
        descricao:   ev.descricao   || "",
        data:        formatarDataInput(ev.data || ev.data_evento),
        hora_inicio: ev.hora_inicio?.slice(0, 5) || "",
        hora_fim:    ev.hora_fim?.slice(0, 5)    || "",
        local:       ev.local       || "",
        logradouro:  end.logradouro || ev.logradouro  || "",
        numero:      end.numero     || ev.numero      || "",
        complemento: end.complemento|| ev.complemento || "",
        bairro:      end.bairro     || ev.bairro      || "",
        cidade:      end.cidade     || ev.cidade      || "",
        estado:      end.estado     || ev.estado      || "",
        cep:         end.cep        || ev.cep         || "",
      });
    } catch (err) {
      console.error(err);
      setErro(err.message || "Não foi possível carregar o evento.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setErro(""); setSucesso("");
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  function handleCancelar() {
    if (!evento) return;
    const end = evento.endereco || {};
    setForm({
      id_endereco_evento: end.id_endereco_evento || null,
      nome:        evento.nome        || evento.evento_nome || "",
      descricao:   evento.descricao   || "",
      data:        formatarDataInput(evento.data || evento.data_evento),
      hora_inicio: evento.hora_inicio?.slice(0, 5) || "",
      hora_fim:    evento.hora_fim?.slice(0, 5)    || "",
      local:       evento.local       || "",
      logradouro:  end.logradouro     || evento.logradouro  || "",
      numero:      end.numero         || evento.numero      || "",
      complemento: end.complemento    || evento.complemento || "",
      bairro:      end.bairro         || evento.bairro      || "",
      cidade:      end.cidade         || evento.cidade      || "",
      estado:      end.estado         || evento.estado      || "",
      cep:         end.cep            || evento.cep         || "",
    });
    setErro(""); setSucesso("");
  }

  async function handleCepBlur(e) {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const dados = await buscarCep(cep);
      if (dados.erro) return;
      setForm((prev) => ({
        ...prev,
        logradouro:  dados.logradouro  || prev.logradouro,
        bairro:      dados.bairro      || prev.bairro,
        cidade:      dados.localidade  || prev.cidade,
        estado:      dados.uf          || prev.estado,
        complemento: dados.complemento || prev.complemento,
      }));
    } catch {
      // CEP não encontrado — mantém campos como estão
    }
  }

  async function handleSalvar() {
    if (!form.nome.trim()) { setErro("O nome do evento é obrigatório."); return; }
    setSalvando(true); setErro(""); setSucesso("");
    try {
      await atualizarEvento(id, { ...form, evento_id: Number(id) });
      setSucesso("Evento atualizado com sucesso!");
      carregarEvento();
    } catch (err) {
      setErro(err.message || "Erro ao salvar evento.");
    } finally {
      setSalvando(false);
    }
  }

  // ── Galeria ─────────────────────────────────────────────────────────

  function handleTrocarFotoAtiva() { fileInputRef.current?.click(); }

  async function handleTrocarArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const idxAtivo     = fotoAtivaRef.current;
    const fotoOriginal = fotosRef.current[idxAtivo];
    e.target.value = "";
    if (!fotoOriginal) return;

    const blobUrl = URL.createObjectURL(arquivo);
    setFotos((prev) => prev.map((f, i) => i === idxAtivo ? { ...f, url: blobUrl, file: arquivo, pendente: true } : f));

    if (fotoOriginal.id_foto) {
      setSalvando(true); setErro(""); setSucesso("");
      try {
        await atualizarFotoEvento(fotoOriginal.id_foto, arquivo, Number(id));
        setFotos((prev) => prev.map((f, i) => i === idxAtivo ? { ...f, pendente: false, file: null } : f));
        setSucesso("Foto substituída com sucesso!");
      } catch (err) {
        setFotos((prev) => prev.map((f, i) => i === idxAtivo ? { ...fotoOriginal } : f));
        setErro(err.message || "Erro ao substituir foto.");
      } finally {
        setSalvando(false);
      }
    }
  }

  const onDragOver  = useCallback((e) => { e.preventDefault(); setDrag(true); }, []);
  const onDragLeave = useCallback(() => setDrag(false), []);
  const onDrop      = useCallback((e) => {
    e.preventDefault(); setDrag(false);
    const arquivos = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (!arquivos.length) return;
    const novas = arquivos.map((f) => ({
      id_foto: null, evento_id: Number(id),
      url: URL.createObjectURL(f), file: f, pendente: true,
    }));
    setFotos((prev) => {
      const lista = [...prev, ...novas];
      const novoIdx = lista.length - 1;
      setFotoAtiva(novoIdx); fotoAtivaRef.current = novoIdx;
      return lista;
    });
  }, [id]);

  function handleAdicionarFoto() { fileAddRef.current?.click(); }

  function handleArquivosAdicionados(e) {
    const arquivos = Array.from(e.target.files);
    if (!arquivos.length) return;
    e.target.value = "";
    const novas = arquivos.map((f) => ({
      id_foto: null, evento_id: Number(id),
      url: URL.createObjectURL(f), file: f, pendente: true,
    }));
    setFotos((prev) => {
      const lista = [...prev, ...novas];
      const novoIdx = lista.length - 1;
      setFotoAtiva(novoIdx); fotoAtivaRef.current = novoIdx;
      return lista;
    });
  }

  async function handleSalvarFotosNovas() {
    const pendentes = fotosRef.current.filter((f) => f.pendente && !f.id_foto && f.file);
    if (!pendentes.length) { setSucesso("Nenhuma foto nova para salvar."); return; }
    setSalvando(true); setErro(""); setSucesso("");
    let salvas = 0, erros = 0;
    for (const foto of pendentes) {
      try { await uploadFotoEvento(Number(id), foto.file); salvas++; }
      catch { erros++; }
    }
    setSalvando(false);
    if (erros === 0) { setSucesso(`${salvas} foto(s) adicionada(s) com sucesso!`); carregarEvento(); }
    else { setErro(`${erros} foto(s) falharam. ${salvas} foram salvas.`); if (salvas > 0) carregarEvento(); }
  }

  async function handleRemoverFoto(idx) {
    const foto = fotosRef.current[idx];
    if (!foto) return;
    if (foto.id_foto) {
      setSalvando(true); setErro(""); setSucesso("");
      try { await deletarFotoEvento(foto.id_foto); setSucesso("Foto removida com sucesso!"); }
      catch (err) { setErro(err.message || "Erro ao remover foto."); setSalvando(false); return; }
      setSalvando(false);
    }
    setFotos((prev) => {
      const novas = prev.filter((_, i) => i !== idx);
      const novoIdx = novas.length === 0 ? 0 : Math.min(idx, novas.length - 1);
      setFotoAtiva(novoIdx); fotoAtivaRef.current = novoIdx;
      return novas;
    });
  }

  const fotoAtivaObj = fotos[fotoAtiva];
  const temPendentes = fotos.some((f) => f.pendente && !f.id_foto && f.file);
  const qtdPendentes = fotos.filter((f) => f.pendente && !f.id_foto && f.file).length;

  // ── Loading / erro ───────────────────────────────────────────────────

  if (loading) return (
    <div className="secs-pagina">
      <HeaderCasaShow />
      <main className="secs-main"><p className="secs-msg">Carregando evento...</p></main>
      <FooterSonara />
    </div>
  );

  if (erro && !evento) return (
    <div className="secs-pagina">
      <HeaderCasaShow />
      <main className="secs-main">
        <p className="secs-msg secs-msg--erro">{erro}</p>
        <button className="secs-btn secs-btn--secundario" onClick={() => navigate("/listaMeusEventos")}>← Voltar</button>
      </main>
      <FooterSonara />
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <div className="secs-pagina">
      <HeaderCasaShow />

      <main className="secs-main">
        <div className="secs-wrapper">

          {/* ══ ESQUERDA — galeria ══════════════════════════════════ */}
          <section className="secs-galeria">

            {/* Foto principal com drag & drop */}
            <div
              className={`secs-galeria__principal${drag ? " secs-galeria__principal--drag" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {fotos.length > 0 && !drag ? (
                <>
                  <img
                    src={fotoAtivaObj?.url || PLACEHOLDER_IMG}
                    alt="Foto principal do evento"
                    className="secs-galeria__img-principal"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                  />
                  {fotoAtivaObj?.pendente && (
                    <span className="secs-galeria__badge">Não salva</span>
                  )}
                  <div className="secs-galeria__overlay">
                    <button className="secs-galeria__btn-acao" onClick={handleTrocarFotoAtiva} disabled={salvando} title="Substituir esta foto">
                      ✎ Trocar
                    </button>
                    <button className="secs-galeria__btn-acao secs-galeria__btn-acao--danger" onClick={() => handleRemoverFoto(fotoAtiva)} disabled={salvando} title="Remover esta foto">
                      ✕ Remover
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="secs-galeria__drop-hint"
                  onClick={() => fileAddRef.current?.click()}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileAddRef.current?.click()}
                  aria-label="Clique ou arraste fotos aqui"
                >
                  <span className="secs-galeria__drop-icon">↑</span>
                  <span className="secs-galeria__drop-label">
                    {drag ? "Solte para adicionar!" : "Arraste fotos aqui ou clique para selecionar"}
                  </span>
                </div>
              )}
            </div>

            {/* Estrelas — espelha sonaraSobreEventoAvaliacao */}
            <div className="secs-galeria__avaliacao">
              {[...Array(totalEstrelas)].map((_, index) => {
                const val = index + 1;
                return (
                  <FaStar
                    key={val}
                    className={val <= (hoverNota || nota) ? "" : "secs-galeria__star-off"}
                    onMouseEnter={() => setHoverNota(val)}
                    onMouseLeave={() => setHoverNota(0)}
                    onClick={() => setNota(val)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
              <span className="secs-galeria__nota-texto">{nota}.0</span>
              <span className="secs-galeria__nota-media">
                Média: {evento?.nota_media || "Sem avaliações"}
              </span>
            </div>

            {/* Miniaturas — espelha .thumb */}
            <div className="secs-galeria__thumbnails">
              {fotos.map((foto, idx) => (
                <button
                  key={idx}
                  className={[
                    "secs-galeria__thumb",
                    idx === fotoAtiva ? "secs-galeria__thumb--ativa"    : "",
                    foto.pendente     ? "secs-galeria__thumb--pendente" : "",
                  ].join(" ")}
                  onClick={() => { setFotoAtiva(idx); fotoAtivaRef.current = idx; }}
                  title={foto.pendente ? "Pendente de upload" : `Foto ${idx + 1}`}
                >
                  <img src={foto.url} alt={`Foto ${idx + 1}`} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} />
                </button>
              ))}
              <button className="secs-galeria__thumb secs-galeria__thumb--add" onClick={handleAdicionarFoto} title="Adicionar fotos">
                +
              </button>
            </div>

            {temPendentes && (
              <div className="secs-galeria__acoes">
                <button className="secs-btn secs-btn--primario" onClick={handleSalvarFotosNovas} disabled={salvando}>
                  {salvando ? "Enviando..." : `Salvar ${qtdPendentes} foto(s) nova(s)`}
                </button>
              </div>
            )}

            {/* Inputs ocultos */}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleTrocarArquivo} />
            <input ref={fileAddRef}   type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleArquivosAdicionados} />
          </section>

          {/* ══ DIREITA — formulário ════════════════════════════════ */}
          <div className="secs-card">
            <div className="secs-form-inner">

              {/* Nome */}
              <section className="secs-secao">
                <label className="secs-secao__titulo" htmlFor="nome">Nome do evento</label>
                <input className="secs-input" id="nome" value={form.nome} onChange={handleChange} placeholder="Nome do evento" />
              </section>

              {/* Descrição */}
              <section className="secs-secao">
                <label className="secs-secao__titulo" htmlFor="descricao">Descrição</label>
                <textarea className="secs-input secs-textarea" id="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição do evento" rows={3} />
              </section>

              {/* Data e Hora — espelha .evento-row */}
              <div className="secs-row">
                <section className="secs-secao">
                  <label className="secs-secao__titulo" htmlFor="data">DATA</label>
                  <input className="secs-input" id="data" type="date" value={form.data} onChange={handleChange} />
                </section>
                <section className="secs-secao">
                  <label className="secs-secao__titulo">HORA</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input className="secs-input" id="hora_inicio" type="time" value={form.hora_inicio} onChange={handleChange} />
                    <span style={{ color: "var(--text-color)", opacity: 0.5, flexShrink: 0 }}>–</span>
                    <input className="secs-input" id="hora_fim" type="time" value={form.hora_fim} onChange={handleChange} />
                  </div>
                </section>
              </div>

              {/* Local */}
              <section className="secs-secao">
                <label className="secs-secao__titulo" htmlFor="local">Local</label>
                <input className="secs-input" id="local" value={form.local} onChange={handleChange} placeholder="Nome do espaço" />
              </section>

              {/* Endereço */}
              <section className="secs-secao">
                <label className="secs-secao__titulo">Endereço</label>
                <div className="secs-grid secs-grid--2" style={{ marginTop: 4 }}>
                  <label className="secs-label secs-label--wide">
                    <span>Logradouro</span>
                    <input className="secs-input" id="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Logradouro" />
                  </label>
                  <label className="secs-label">
                    <span>Número</span>
                    <input className="secs-input" id="numero" value={form.numero} onChange={handleChange} placeholder="Número" />
                  </label>
                  <label className="secs-label">
                    <span>Complemento</span>
                    <input className="secs-input" id="complemento" value={form.complemento} onChange={handleChange} placeholder="Complemento" />
                  </label>
                  <label className="secs-label">
                    <span>Bairro</span>
                    <input className="secs-input" id="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" />
                  </label>
                  <label className="secs-label">
                    <span>Cidade</span>
                    <input className="secs-input" id="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" />
                  </label>
                  <label className="secs-label">
                    <span>UF</span>
                    <input className="secs-input" id="estado" value={form.estado} onChange={handleChange} placeholder="UF" maxLength={2} />
                  </label>
                  <label className="secs-label">
                    <span>CEP</span>
                    <input className="secs-input" id="cep" value={form.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="00000-000" maxLength={9} />
                  </label>
                </div>
              </section>

              {/* Feedback */}
              {erro    && <p className="secs-feedback secs-feedback--erro">{erro}</p>}
              {sucesso && <p className="secs-feedback secs-feedback--sucesso">{sucesso}</p>}

              {/* Ações */}
              <div className="secs-acoes">
                <button className="secs-btn secs-btn--secundario" onClick={handleCancelar} disabled={salvando}>Cancelar</button>
                <button className="secs-btn secs-btn--primario"   onClick={handleSalvar}   disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
                <button className="secs-btn secs-btn--neutro" onClick={() => navigate(`/evento/${id}/inscritos`)}>Ver Inscritos</button>
                <button className="secs-btn secs-btn--neutro" onClick={() => navigate("/listaMeusEventos")}>← Voltar</button>
              </div>

            </div>
          </div>

        </div>
      </main>

      <FooterSonara />
    </div>
  );
}