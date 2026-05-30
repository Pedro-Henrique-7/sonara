import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const PLACEHOLDER_IMG = fotoShow;

function formatarDataInput(dataISO) {
  if (!dataISO) return "";
  return new Date(dataISO).toISOString().split("T")[0];
}

/**
 * Cada item de `fotos` tem o formato:
 * {
 *   id_foto:   number | null,   // null = foto nova ainda não salva no banco
 *   evento_id: number,
 *   url:       string,          // URL Azure ou blob URL local (preview)
 *   file:      File | null,     // File pendente de upload (null = já salva)
 *   pendente:  boolean,
 * }
 */

export default function SobreEventoCasaShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  // refs para inputs de arquivo ocultos
  const fileInputRef = useRef(null); // troca de foto existente
  const fileAddRef   = useRef(null); // adicionar novas fotos

  const [evento,   setEvento]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [erro,     setErro]     = useState("");
  const [sucesso,  setSucesso]  = useState("");
  const [salvando, setSalvando] = useState(false);

  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [fotos,     setFotos]     = useState([]);
  const [drag,      setDrag]      = useState(false);

  // Refs espelho para leitura síncrona dentro de handlers assíncronos
  // (evitam o problema de closure stale com state)
  const fotosRef    = useRef([]);
  const fotoAtivaRef = useRef(0);

  // Mantém os refs sempre sincronizados
  useEffect(() => { fotosRef.current    = fotos;     }, [fotos]);
  useEffect(() => { fotoAtivaRef.current = fotoAtiva; }, [fotoAtiva]);

  const [form, setForm] = useState({
    id_endereco_evento: null,
    nome: "",
    descricao: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
    local: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => { carregarEvento(); }, [id]);

  // ── Carrega evento ──────────────────────────────────────────────────
  async function carregarEvento() {
    try {
      setLoading(true);
      setErro("");

      const json = await buscarEventosPorId(id);
      const ev =
        json?.response?.evento ||
        json?.response?.Evento ||
        json?.evento ||
        json;

      if (!ev || Object.keys(ev).length === 0)
        throw new Error("Evento não encontrado.");

      setEvento(ev);

      // Monta array de fotos com metadados
      // Backend retorna: fotos: [{ url, id_foto }, ...]
      const fotosBackend = ev.fotos?.length
        ? ev.fotos.map((f) => ({
            id_foto:   f.id_foto ?? f.id ?? null,
            evento_id: Number(id),
            url:       f.url ?? f.foto ?? "",
            file:      null,
            pendente:  false,
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
      });
    } catch (err) {
      console.error(err);
      setErro(err.message || "Não foi possível carregar o evento.");
    } finally {
      setLoading(false);
    }
  }

  // ── Form helpers ────────────────────────────────────────────────────
  function handleChange(e) {
    setErro("");
    setSucesso("");
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  function handleCancelar() {
    if (!evento) return;
    const end = evento.endereco || {};
    setForm({
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
      id_endereco_evento: end.id_endereco_evento || null,
    });
    setErro("");
    setSucesso("");
  }

  async function handleSalvar() {
    if (!form.nome.trim()) {
      setErro("O nome do evento é obrigatório.");
      return;
    }
    setSalvando(true);
    setErro("");
    setSucesso("");
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

  // ══════════════════════════════════════════════════════════════════
  //  GALERIA — lógica de fotos
  // ══════════════════════════════════════════════════════════════════

  /** Abre o seletor para TROCAR a foto ativa. */
  function handleTrocarFotoAtiva() {
    fileInputRef.current?.click();
  }

  /**
   * Usuário escolheu arquivo para substituir a foto ativa.
   *
   * Usa fotosRef e fotoAtivaRef (leitura síncrona) para evitar
   * closure stale — o state pode estar desatualizado dentro de
   * um handler assíncrono.
   */
  async function handleTrocarArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    // Lê o índice e o objeto da foto via ref (valores atuais garantidos)
    const idxAtivo    = fotoAtivaRef.current;
    const fotoOriginal = fotosRef.current[idxAtivo];

    // Limpa o input DEPOIS de ler o arquivo
    e.target.value = "";

    if (!fotoOriginal) return;

    // 1. Preview imediato com blob URL
    const blobUrl = URL.createObjectURL(arquivo);
    setFotos((prev) =>
      prev.map((f, i) =>
        i === idxAtivo ? { ...f, url: blobUrl, file: arquivo, pendente: true } : f
      )
    );

    // 2. Se a foto já existe no banco → PUT imediato
    if (fotoOriginal.id_foto) {
      setSalvando(true);
      setErro("");
      setSucesso("");
      try {
        await atualizarFotoEvento(fotoOriginal.id_foto, arquivo, Number(id));
        // Marca como salva e atualiza URL para o blob (a URL real virá no próximo carregarEvento)
        setFotos((prev) =>
          prev.map((f, i) =>
            i === idxAtivo ? { ...f, pendente: false, file: null } : f
          )
        );
        setSucesso("Foto substituída com sucesso!");
      } catch (err) {
        // Reverte o preview em caso de erro
        setFotos((prev) =>
          prev.map((f, i) =>
            i === idxAtivo
              ? { ...fotoOriginal }   // volta ao estado original
              : f
          )
        );
        setErro(err.message || "Erro ao substituir foto.");
      } finally {
        setSalvando(false);
      }
    }
    // Se não tem id_foto (foto nova sem id ainda) → fica pendente
  }


  // ── Drag & Drop ──────────────────────────────────────────────────────
  const onDragOver  = useCallback((e) => { e.preventDefault(); setDrag(true);  }, []);
  const onDragLeave = useCallback(() => setDrag(false), []);
  const onDrop      = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const arquivos = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (!arquivos.length) return;

    const novas = arquivos.map((f) => ({
      id_foto:   null,
      evento_id: Number(id),
      url:       URL.createObjectURL(f),
      file:      f,
      pendente:  true,
    }));

    setFotos((prev) => {
      const lista = [...prev, ...novas];
      const novoIdx = lista.length - 1;
      setFotoAtiva(novoIdx);
      fotoAtivaRef.current = novoIdx;
      return lista;
    });
  }, [id]);

  /** Abre seletor para ADICIONAR novas fotos. */
  function handleAdicionarFoto() {
    fileAddRef.current?.click();
  }

  /** Adiciona arquivos como previews pendentes. */
  function handleArquivosAdicionados(e) {
    const arquivos = Array.from(e.target.files);
    if (!arquivos.length) return;
    e.target.value = "";

    const novas = arquivos.map((f) => ({
      id_foto:   null,
      evento_id: Number(id),
      url:       URL.createObjectURL(f),
      file:      f,
      pendente:  true,
    }));

    setFotos((prev) => {
      const lista = [...prev, ...novas];
      const novoIdx = lista.length - 1;
      setFotoAtiva(novoIdx);
      fotoAtivaRef.current = novoIdx;
      return lista;
    });
  }

  /** Envia todas as fotos novas (sem id_foto) via POST. */
  async function handleSalvarFotosNovas() {
    const pendentes = fotosRef.current.filter((f) => f.pendente && !f.id_foto && f.file);
    if (!pendentes.length) {
      setSucesso("Nenhuma foto nova para salvar.");
      return;
    }

    setSalvando(true);
    setErro("");
    setSucesso("");

    let salvas = 0;
    let erros  = 0;

    for (const foto of pendentes) {
      try {
        await uploadFotoEvento(Number(id), foto.file);
        salvas++;
      } catch {
        erros++;
      }
    }

    setSalvando(false);

    if (erros === 0) {
      setSucesso(`${salvas} foto(s) adicionada(s) com sucesso!`);
      carregarEvento();
    } else {
      setErro(`${erros} foto(s) falharam. ${salvas} foram salvas.`);
      if (salvas > 0) carregarEvento();
    }
  }

  /** Remove foto da lista local (sem endpoint de delete). */
  async function handleRemoverFoto(idx) {
    const foto = fotosRef.current[idx];
    if (!foto) return;

    // Foto já salva no banco → DELETE real
    if (foto.id_foto) {
      setSalvando(true);
      setErro("");
      setSucesso("");
      try {
        await deletarFotoEvento(foto.id_foto);
        setSucesso("Foto removida com sucesso!");
      } catch (err) {
        setErro(err.message || "Erro ao remover foto.");
        setSalvando(false);
        return; // não remove do state se o backend falhou
      }
      setSalvando(false);
    }

    // Remove do state local
    setFotos((prev) => {
      const novas = prev.filter((_, i) => i !== idx);
      const novoIdx = novas.length === 0 ? 0 : Math.min(idx, novas.length - 1);
      setFotoAtiva(novoIdx);
      fotoAtivaRef.current = novoIdx;
      return novas;
    });
  }

  // ── Derived ─────────────────────────────────────────────────────────
  const fotoAtivaObj = fotos[fotoAtiva];
  const temPendentes = fotos.some((f) => f.pendente && !f.id_foto && f.file);
  const qtdPendentes = fotos.filter((f) => f.pendente && !f.id_foto && f.file).length;

  // ── Loading / erro ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="secs-pagina">
        <HeaderCasaShow />
        <main className="secs-main"><p className="secs-msg">Carregando evento...</p></main>
        <FooterSonara />
      </div>
    );
  }

  if (erro && !evento) {
    return (
      <div className="secs-pagina">
        <HeaderCasaShow />
        <main className="secs-main">
          <p className="secs-msg secs-msg--erro">{erro}</p>
          <button className="secs-btn secs-btn--secundario" onClick={() => navigate("/listaMeusEventos")}>← Voltar</button>
        </main>
        <FooterSonara />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="secs-pagina">
      <HeaderCasaShow />

      <main className="secs-main">
        <div className="secs-wrapper">

          {/* ══ GALERIA ══════════════════════════════════════════════ */}
          <section className="secs-galeria">

            {/* Foto principal — também é zona de drop */}
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
                    <button
                      className="secs-galeria__btn-acao"
                      onClick={handleTrocarFotoAtiva}
                      disabled={salvando}
                      title="Substituir esta foto"
                    >
                      ✎ Trocar
                    </button>
                    <button
                      className="secs-galeria__btn-acao secs-galeria__btn-acao--danger"
                      onClick={() => handleRemoverFoto(fotoAtiva)}
                      disabled={salvando}
                      title="Remover esta foto"
                    >
                      ✕ Remover
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="secs-galeria__drop-hint"
                  onClick={() => fileAddRef.current?.click()}
                  role="button"
                  tabIndex={0}
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

            {/* Miniaturas */}
            <div className="secs-galeria__thumbnails">
              {fotos.map((foto, idx) => (
                <button
                  key={idx}
                  className={[
                    "secs-galeria__thumb",
                    idx === fotoAtiva      ? "secs-galeria__thumb--ativa"    : "",
                    foto.pendente          ? "secs-galeria__thumb--pendente" : "",
                  ].join(" ")}
                  onClick={() => {
                    setFotoAtiva(idx);
                    fotoAtivaRef.current = idx;
                  }}
                  title={foto.pendente ? "Pendente de upload" : `Foto ${idx + 1}`}
                >
                  <img
                    src={foto.url}
                    alt={`Foto ${idx + 1}`}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                  />
                </button>
              ))}

              <button
                className="secs-galeria__thumb secs-galeria__thumb--add"
                onClick={handleAdicionarFoto}
                title="Adicionar fotos"
              >
                +
              </button>
            </div>

            {/* Botão salvar fotos novas — aparece só quando há pendentes */}
            {temPendentes && (
              <div className="secs-galeria__acoes">
                <button
                  className="secs-btn secs-btn--primario"
                  onClick={handleSalvarFotosNovas}
                  disabled={salvando}
                >
                  {salvando ? "Enviando..." : `Salvar ${qtdPendentes} foto(s) nova(s)`}
                </button>
              </div>
            )}

            {/* Inputs ocultos */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleTrocarArquivo}
            />
            <input
              ref={fileAddRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleArquivosAdicionados}
            />
          </section>

          {/* ══ FORMULÁRIO ════════════════════════════════════════════ */}
          <section className="secs-card">

            <div className="secs-secao">
              <h3 className="secs-secao__titulo">Informações do Evento</h3>
              <div className="secs-grid secs-grid--2">
                <label className="secs-label">
                  <span>Nome do evento</span>
                  <input className="secs-input" id="nome" value={form.nome} onChange={handleChange} placeholder="Nome do evento" />
                </label>
                <label className="secs-label">
                  <span>Local / Espaço</span>
                  <input className="secs-input" id="local" value={form.local} onChange={handleChange} placeholder="Nome do espaço" />
                </label>
              </div>
              <label className="secs-label" style={{ marginTop: "1rem" }}>
                <span>Descrição</span>
                <textarea className="secs-input secs-textarea" id="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição do evento" rows={4} />
              </label>
            </div>

            <div className="secs-secao">
              <h3 className="secs-secao__titulo">Data e Horário</h3>
              <div className="secs-grid secs-grid--3">
                <label className="secs-label">
                  <span>Data</span>
                  <input className="secs-input" id="data" type="date" value={form.data} onChange={handleChange} />
                </label>
                <label className="secs-label">
                  <span>Início</span>
                  <input className="secs-input" id="hora_inicio" type="time" value={form.hora_inicio} onChange={handleChange} />
                </label>
                <label className="secs-label">
                  <span>Término</span>
                  <input className="secs-input" id="hora_fim" type="time" value={form.hora_fim} onChange={handleChange} />
                </label>
              </div>
            </div>

            <div className="secs-secao">
              <h3 className="secs-secao__titulo">Endereço</h3>
              <div className="secs-grid secs-grid--2">
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
              </div>
            </div>

            {erro    && <p className="secs-feedback secs-feedback--erro">{erro}</p>}
            {sucesso && <p className="secs-feedback secs-feedback--sucesso">{sucesso}</p>}

            <div className="secs-acoes">
              <button className="secs-btn secs-btn--secundario" onClick={handleCancelar} disabled={salvando}>Cancelar</button>
              <button className="secs-btn secs-btn--primario"   onClick={handleSalvar}   disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button className="secs-btn secs-btn--neutro" onClick={() => navigate(`/evento/${id}/inscritos`)}>Ver Inscritos</button>
              <button className="secs-btn secs-btn--neutro" onClick={() => navigate("/listaMeusEventos")}>← Voltar</button>
            </div>

          </section>
        </div>
      </main>

      <FooterSonara />
    </div>
  );
}