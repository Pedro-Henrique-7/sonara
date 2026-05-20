import { useRef, useState } from "react";
import "./marcarEvento.css";
import HeaderCasaShow from "./headerCasaShow.jsx";
import show1 from "../img/show1.jfif";
import show2 from "../img/show2.webp";
import show3 from "../img/show3.png";
import FooterSonara from "../Artista/footer.jsx";

import { cadastrarEvento } from "../services/eventoService";
import { buscarCep } from "../services/enderecoService.js";

const API_URL = import.meta.env.VITE_API_URL;

export default function MarcarEvento() {
  const usuarioObj = JSON.parse(sessionStorage.getItem("usuario") ?? "null");
  const organizador_id = usuarioObj?.id_usuario ?? null;

  const inputFotoRef = useRef(null);

  const [form, setForm] = useState({
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
    organizador_id: "",
  });

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep]         = useState(null);
  const [enviando, setEnviando]       = useState(false);
  const [erro, setErro]               = useState(null);
  const [sucesso, setSucesso]         = useState(false);

  // Upload de fotos
  const [idEventoCriado, setIdEventoCriado] = useState(null);
  const [previews, setPreviews]             = useState([]);
  const [enviandoFotos, setEnviandoFotos]   = useState(false);

  // ─── Formulário do evento ───────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCepBlur() {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    setErroCep(null);
    setBuscandoCep(true);

    try {
      const dados = await buscarCep(cepLimpo);
      if (dados.erro) { setErroCep("CEP não encontrado."); return; }
      setForm((prev) => ({
        ...prev,
        logradouro:  dados.logradouro  ?? "",
        complemento: dados.complemento ?? "",
        bairro:      dados.bairro      ?? "",
        cidade:      dados.localidade  ?? "",
        estado:      dados.uf          ?? "",
      }));
    } catch {
      setErroCep("Erro ao buscar CEP. Verifique e tente novamente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (!organizador_id) {
      setErro("Você precisa estar logado para marcar um evento.");
      return;
    }

    setEnviando(true);

    try {
      const json = await cadastrarEvento({ ...form, organizador_id });

      // Guarda o id do evento criado para o upload de fotos
      const idCriado = json?.response?.evento?.id_evento ?? null;
      setIdEventoCriado(idCriado);

      setSucesso(true);
      setForm({
        nome: "", descricao: "", local: "", data: "",
        hora_inicio: "", hora_fim: "", cep: "", logradouro: "",
        numero: "", complemento: "", bairro: "", cidade: "", estado: "",
        organizador_id: "",
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  // ─── Upload de fotos ────────────────────────────────────────────────────────
  function handleSelecionarFotos(e) {
    const arquivos = Array.from(e.target.files);
    if (!arquivos.length) return;

    const novas = arquivos.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      status: "pendente", // pendente | enviando | ok | erro
      erro: null,
    }));

    setPreviews((prev) => [...prev, ...novas]);
    e.target.value = "";
  }

  function removerPreview(index) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function enviarFotos() {
    if (!idEventoCriado) {
      alert("Salve o evento primeiro antes de adicionar fotos.");
      return;
    }

    const pendentes = previews.filter((p) => p.status === "pendente");
    if (!pendentes.length) return;

    setEnviandoFotos(true);

    for (let i = 0; i < previews.length; i++) {
      if (previews[i].status !== "pendente") continue;

      setPreviews((prev) =>
        prev.map((p, idx) => (idx === i ? { ...p, status: "enviando" } : p))
      );

      try {
        const formData = new FormData();
        formData.append("foto", previews[i].file);
        formData.append("evento_id", String(idEventoCriado));

        const res  = await fetch(`${API_URL}/v1/sonara/eventoFoto`, {
          method: "POST",
          body: formData,
          // NÃO definir Content-Type — o browser monta o boundary automaticamente
        });

        const json = await res.json();

        if (res.ok) {
          setPreviews((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, status: "ok" } : p))
          );
        } else {
          throw new Error(json.message ?? "Erro ao enviar foto");
        }
      } catch (err) {
        setPreviews((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: "erro", erro: err.message } : p
          )
        );
      }
    }

    setEnviandoFotos(false);
  }

  const totalPendentes = previews.filter((p) => p.status === "pendente").length;

  return (
    <div className="pagina">
      <HeaderCasaShow />
      <main className="main">
        <section className="card-evento">

          {/* GALERIA */}
          <div className="galeria">
            <div className="foto_Show">
              <img src={show2} alt="Show 2" />
            </div>
            <div className="miniaturas">
              <img src={show1} alt="Show 1" />
              <img src={show2} alt="Show 2" />
              <img src={show3} alt="Show 3" />
              <div className="mais-fotos">+3</div>
            </div>

            {/* Input oculto */}
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              style={{ display: "none" }}
              onChange={handleSelecionarFotos}
            />

            <button
              className="btn-fotos"
              type="button"
              onClick={() => inputFotoRef.current?.click()}
            >
              Adicionar mais fotos
            </button>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="preview-grid">
                {previews.map((item, i) => (
                  <div key={i} className={`preview-item preview-${item.status}`}>
                    <img src={item.url} alt={`preview-${i}`} />

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
                      <button className="btn-remover-foto" type="button" onClick={() => removerPreview(i)}>×</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Botão enviar fotos — aparece só quando há pendentes E o evento já foi salvo */}
            {totalPendentes > 0 && (
              <button
                className="btn-marcar"
                type="button"
                onClick={enviarFotos}
                disabled={enviandoFotos}
                style={{ marginTop: "12px", width: "210px", fontSize: "16px" }}
              >
                {enviandoFotos ? "Enviando..." : `Enviar ${totalPendentes} foto(s)`}
              </button>
            )}
          </div>

          {/* FORMULÁRIO */}
          <form className="formulario" onSubmit={handleSubmit}>

            {sucesso && <p className="msg-sucesso">Evento marcado com sucesso! Agora você pode adicionar fotos.</p>}
            {erro    && <p className="msg-erro">{erro}</p>}

            <label>nome do evento:</label>
            <input
              type="text" name="nome" value={form.nome}
              onChange={handleChange} placeholder="Digite aqui"
              required maxLength={100}
            />

            <label>Descrição:</label>
            <textarea
              name="descricao" value={form.descricao}
              onChange={handleChange} placeholder="Digite aqui"
              required maxLength={500}
            />

            <label>Local:</label>
            <input
              type="text" name="local" value={form.local}
              onChange={handleChange} placeholder="Nome do local"
              required maxLength={255}
            />

            <div className="linha-inputs">
              <div className="campo">
                <label>Data</label>
                <input type="date" name="data" value={form.data} onChange={handleChange} required />
              </div>
              <div className="campo">
                <label>Hora de Início</label>
                <input type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} required />
              </div>
              <div className="campo">
                <label>Hora de Fim</label>
                <input type="time" name="hora_fim" value={form.hora_fim} onChange={handleChange} required />
              </div>
            </div>

            {/* ENDEREÇO */}
            <div className="endereco-section">
              <h2>Endereço</h2>

              <div className="campo" style={{ width: "100%" }}>
                <label>CEP</label>
                <input
                  type="text" name="cep" value={form.cep}
                  onChange={handleChange} onBlur={handleCepBlur}
                  placeholder="00000-000" required maxLength={11}
                />
                {buscandoCep && <span className="cep-info">Buscando CEP...</span>}
                {erroCep     && <span className="cep-erro">{erroCep}</span>}
              </div>

              <div className="linha-inputs">
                <div className="campo">
                  <label>Rua</label>
                  <input type="text" name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Digite a rua" required maxLength={255} />
                </div>
                <div className="campo">
                  <label>Número</label>
                  <input type="text" name="numero" value={form.numero} onChange={handleChange} placeholder="123" required />
                </div>
              </div>

              <div className="campo" style={{ width: "100%" }}>
                <label>Complemento</label>
                <input type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Sala, bloco..." maxLength={100} />
              </div>

              <div className="linha-inputs">
                <div className="campo">
                  <label>Bairro</label>
                  <input type="text" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Digite o bairro" required maxLength={100} />
                </div>
                <div className="campo">
                  <label>Cidade</label>
                  <input type="text" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Digite a cidade" required maxLength={170} />
                </div>
                <div className="campo">
                  <label>Estado</label>
                  <input type="text" name="estado" value={form.estado} onChange={handleChange} placeholder="SP" required maxLength={2} />
                </div>
              </div>
            </div>

            <button className="btn-marcar" type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Marcar Evento"}
            </button>

          </form>
        </section>
      </main>

      <FooterSonara />
    </div>
  );
}