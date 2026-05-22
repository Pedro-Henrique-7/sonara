import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./marcarEvento.css";
import HeaderCasaShow from "./headerCasaShow.jsx";
import FooterSonara from "../Artista/footer.jsx";

import { cadastrarEvento } from "../services/eventoService";
import { buscarCep } from "../services/enderecoService.js";

const API_URL = import.meta.env.VITE_API_URL;

export default function MarcarEvento() {
  const navigate = useNavigate();
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
  const [erroCep, setErroCep] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  // 2. O estado só guarda as fotos do usuário
  const [previews, setPreviews] = useState([]);

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
      if (dados.erro) {
        setErroCep("CEP não encontrado.");
        return;
      }
      setForm((prev) => ({
        ...prev,
        logradouro: dados.logradouro ?? "",
        complemento: dados.complemento ?? "",
        bairro: dados.bairro ?? "",
        cidade: dados.localidade ?? "",
        estado: dados.uf ?? "",
      }));
    } catch {
      setErroCep("Erro ao buscar CEP. Verifique e tente novamente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  // ─── Seleção de fotos — atualiza a galeria imediatamente ───────────────────
  function handleSelecionarFotos(e) {
    const arquivos = Array.from(e.target.files);
    if (!arquivos.length) return;

    const novas = arquivos.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      status: "pendente",
      erro: null,
    }));

    // Remove as imagens estáticas na primeira seleção; acumula nas próximas
    setPreviews((prev) => [...prev, ...novas]);
    e.target.value = "";
  }

  function removerPreview(index) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // ─── Submit: cria evento e envia fotos em seguida ──────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (!organizador_id) {
      setErro("Você precisa estar logado para marcar um evento.");
      return;
    }

    setEnviando(true);

    try {
      // 1️⃣  Cria o evento
      const json = await cadastrarEvento({ ...form, organizador_id });
      const idCriado = json?.response?.evento?.id_evento ?? null;

      // 2️⃣  Envia as fotos pendentes logo após criar o evento
      const pendentes = previews.filter((p) => p.status === "pendente");

      if (idCriado && pendentes.length > 0) {
        // Usamos um snapshot local do array para indexar corretamente
        const snapshotPreviews = [...previews];

        for (let i = 0; i < snapshotPreviews.length; i++) {
          if (snapshotPreviews[i].status !== "pendente") continue;

          setPreviews((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: "enviando" } : p,
            ),
          );

          try {
            const formData = new FormData();
            formData.append("foto", snapshotPreviews[i].file);
            formData.append("evento_id", String(idCriado));

            const res = await fetch(`${API_URL}/eventoFoto`, {
              method: "POST",
              body: formData,
            });
            const fotoJson = await res.json();

            setPreviews((prev) =>
              prev.map((p, idx) =>
                idx === i
                  ? {
                      ...p,
                      status: res.ok ? "ok" : "erro",
                      erro: res.ok
                        ? null
                        : (fotoJson.message ?? "Erro ao enviar foto"),
                    }
                  : p,
              ),
            );
          } catch (err) {
            setPreviews((prev) =>
              prev.map((p, idx) =>
                idx === i ? { ...p, status: "erro", erro: err.message } : p,
              ),
            );
          }
        }
      }

      setSucesso(true);

      setTimeout(() => {
        navigate("/casaShow");
      }, 1500);

      setForm({
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
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  // Foto principal = primeira da lista (pode ser estática ou selecionada)
  const fotoPrincipal = previews[0]?.url;

  return (
    <div className="pagina">
      <HeaderCasaShow />
      <main className="main">
        <section className="card-evento">
          {/* GALERIA — atualiza conforme previews */}
          <div className="galeria">
            <div className="foto_Show">
              {fotoPrincipal ? (
                <img src={fotoPrincipal} alt="Foto principal" />
              ) : (
                <div className="sem-foto">
                  <span>Nenhuma foto adicionada</span>
                </div>
              )}
            </div>

            {previews.length > 1 && (
              <div className="miniaturas">
                {previews.slice(1, 5).map((item, i) => (
                  <img key={i} src={item.url} alt={`miniatura-${i}`} />
                ))}

                {previews.length > 5 && (
                  <div className="mais-fotos">+{previews.length - 5}</div>
                )}
              </div>
            )}

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
              Adicionar fotos
            </button>

            {previews.length > 0 && (
              <div className="preview-grid">
                {previews.map((item, i) => (
                  <div
                    key={i}
                    className={`preview-item preview-${item.status}`}
                  >
                    <img src={item.url} alt={`preview-${i}`} />

                    {item.status === "enviando" && (
                      <div className="preview-overlay">
                        <span className="spinner" />
                      </div>
                    )}

                    {item.status === "ok" && (
                      <div className="preview-overlay overlay-ok">✓</div>
                    )}

                    {item.status === "erro" && (
                      <div
                        className="preview-overlay overlay-erro"
                        title={item.erro}
                      >
                        ✗
                      </div>
                    )}

                    {item.status === "pendente" && (
                      <button
                        className="btn-remover-foto"
                        type="button"
                        onClick={() => removerPreview(i)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FORMULÁRIO */}
          <form className="formulario" onSubmit={handleSubmit}>
            {erro && <p className="msg-erro">{erro}</p>}

            <label>nome do evento:</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite aqui"
              required
              maxLength={100}
            />

            <label>Descrição:</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Digite aqui"
              required
              maxLength={500}
            />

            <label>Local:</label>
            <input
              type="text"
              name="local"
              value={form.local}
              onChange={handleChange}
              placeholder="Nome do local"
              required
              maxLength={255}
            />

            <div className="linha-inputs">
              <div className="campo">
                <label>Data</label>
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="campo">
                <label>Hora de Início</label>
                <input
                  type="time"
                  name="hora_inicio"
                  value={form.hora_inicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="campo">
                <label>Hora de Fim</label>
                <input
                  type="time"
                  name="hora_fim"
                  value={form.hora_fim}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ENDEREÇO */}
            <div className="endereco-section">
              <h2>Endereço</h2>

              <div className="campo" style={{ width: "100%" }}>
                <label>CEP</label>
                <input
                  type="text"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  required
                  maxLength={11}
                />
                {buscandoCep && (
                  <span className="cep-info">Buscando CEP...</span>
                )}
                {erroCep && <span className="cep-erro">{erroCep}</span>}
              </div>

              <div className="linha-inputs">
                <div className="campo">
                  <label>Rua</label>
                  <input
                    type="text"
                    name="logradouro"
                    value={form.logradouro}
                    onChange={handleChange}
                    placeholder="Digite a rua"
                    required
                    maxLength={255}
                  />
                </div>
                <div className="campo">
                  <label>Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={form.numero}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="campo" style={{ width: "100%" }}>
                <label>Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={form.complemento}
                  onChange={handleChange}
                  placeholder="Sala, bloco..."
                  maxLength={100}
                />
              </div>

              <div className="linha-inputs">
                <div className="campo">
                  <label>Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={form.bairro}
                    onChange={handleChange}
                    placeholder="Digite o bairro"
                    required
                    maxLength={100}
                  />
                </div>
                <div className="campo">
                  <label>Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={form.cidade}
                    onChange={handleChange}
                    placeholder="Digite a cidade"
                    required
                    maxLength={170}
                  />
                </div>
                <div className="campo">
                  <label>Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    placeholder="SP"
                    required
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
            {sucesso && (
              <p className="msg-sucesso">Evento marcado com sucesso!</p>
            )}

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
