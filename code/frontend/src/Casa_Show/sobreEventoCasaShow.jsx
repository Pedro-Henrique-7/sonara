import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderCasaShow from "./headerCasaShow.jsx";
import "./sobreEventoCasaShow.css";
import fotoShow from "../img/fotoShow.png";
import FooterSonara from "../Artista/footer.jsx";
import { buscarEventosPorId, atualizarEvento } from "../services/eventoService";

const PLACEHOLDER_IMG = fotoShow;

function formatarDataInput(dataISO) {
  if (!dataISO) return "";
  return new Date(dataISO).toISOString().split("T")[0];
}

export default function SobreEventoCasaShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);

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

  useEffect(() => {
    carregarEvento();
  }, [id]);

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

      if (!ev || Object.keys(ev).length === 0) {
        throw new Error("Evento não encontrado.");
      }

      setEvento(ev);

      const end = ev.endereco || {};

      setForm({
        id_endereco_evento: end.id_endereco_evento || ev.id_endereco_evento || null,

        nome: ev.nome || ev.evento_nome || "",
        descricao: ev.descricao || "",
        data: formatarDataInput(ev.data || ev.data_evento),
        hora_inicio: ev.hora_inicio?.slice(0, 5) || "",
        hora_fim: ev.hora_fim?.slice(0, 5) || "",
        local: ev.local || "",

        logradouro: end.logradouro || ev.logradouro || "",
        numero: end.numero || ev.numero || "",
        complemento: end.complemento || ev.complemento || "",
        bairro: end.bairro || ev.bairro || "",
        cidade: end.cidade || ev.cidade || "",
        estado: end.estado || ev.estado || "",
      });
    } catch (err) {
      console.error(err);
      setErro(err.message || "Não foi possível carregar o evento.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setErro("");
    setSucesso("");
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function handleCancelar() {
    if (!evento) return;
    const end = evento.endereco || {};
    setForm({
      nome: evento.nome || evento.evento_nome || "",
      descricao: evento.descricao || "",
      data: formatarDataInput(evento.data || evento.data_evento),
      hora_inicio: evento.hora_inicio?.slice(0, 5) || "",
      hora_fim: evento.hora_fim?.slice(0, 5) || "",
      local: evento.local || "",
      logradouro: end.logradouro || evento.logradouro || "",
      numero: end.numero || evento.numero || "",
      complemento: end.complemento || evento.complemento || "",
      bairro: end.bairro || evento.bairro || "",
      cidade: end.cidade || evento.cidade || "",
      estado: end.estado || evento.estado || "",
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
    const payload = {
      ...form,
      evento_id: Number(id),
      id_endereco_evento: form.id_endereco_evento
    };

    await atualizarEvento(id, payload);

    setSucesso("Evento atualizado com sucesso!");
    carregarEvento();
  } catch (err) {
    setErro(err.message || "Erro ao salvar evento.");
  } finally {
    setSalvando(false);
  }
}

  const imagem = evento?.fotos?.[0]?.url || evento?.url_foto || PLACEHOLDER_IMG;

  if (loading) {
    return (
      <div className="sobreEventoPagina">
        <HeaderCasaShow />
        <main className="sobreEventoConteudoPrincipal">
          <p style={{ color: "rgba(255,255,255,0.7)", padding: "2rem" }}>
            Carregando evento...
          </p>
        </main>
        <FooterSonara />
      </div>
    );
  }

  if (erro && !evento) {
    return (
      <div className="sobreEventoPagina">
        <HeaderCasaShow />
        <main className="sobreEventoConteudoPrincipal">
          <p style={{ color: "#ffb3a7", padding: "2rem" }}>{erro}</p>
          <button className="pa-btn pa-btn-cancelar" onClick={() => navigate("/listaMeusEventos")}>
            Voltar
          </button>
        </main>
        <FooterSonara />
      </div>
    );
  }

  return (
    <div className="sobreEventoPagina">
      <HeaderCasaShow />

      <main className="sobreEventoConteudoPrincipal">
        <div className="pa-central" style={{ flexDirection: "column", alignItems: "center" }}>

          <div style={{ width: "100%", maxWidth: "900px" }}>
            <img
              src={imagem}
              alt="evento"
              className="sobreEventoImagemPrincipal"
              onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
            />
          </div>

          <div className="pa-dados-card" style={{ width: "100%", maxWidth: "900px" }}>

            <h3 className="pa-card-title">Informações do Evento</h3>
            <div className="pa-dados-grid">
              <input
                className="pa-input"
                id="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome do evento"
              />
              <input
                className="pa-input"
                id="local"
                value={form.local}
                onChange={handleChange}
                placeholder="Local / Nome do espaço"
              />
            </div>

            <div className="pa-dados-grid" style={{ marginTop: "0.8rem" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <textarea
                  className="pa-input"
                  id="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Descrição do evento"
                  rows={4}
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>
            </div>

            <h3 className="pa-card-title" style={{ marginTop: "1.2rem" }}>
              Data e Horário
            </h3>
            <div className="pa-dados-grid">
              <input
                className="pa-input"
                id="data"
                type="date"
                value={form.data}
                onChange={handleChange}
              />
              <input
                className="pa-input"
                id="hora_inicio"
                type="time"
                value={form.hora_inicio}
                onChange={handleChange}
              />
              <input
                className="pa-input"
                id="hora_fim"
                type="time"
                value={form.hora_fim}
                onChange={handleChange}
              />
            </div>

            <h3 className="pa-card-title" style={{ marginTop: "1.2rem" }}>
              Endereço
            </h3>
            <div className="pa-dados-grid">
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
                id="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Complemento"
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
            </div>

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
                disabled={salvando}
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
                onClick={() => navigate(`/evento/${id}/inscritos`)}
                style={{ backgroundColor: "#555", color: "#fff", marginLeft: "auto" }}
              >
                Ver Inscritos
              </button>
              <button
                className="pa-btn pa-btn-deletar"
                onClick={() => navigate("/listaMeusEventos")}
                style={{ backgroundColor: "#333", color: "#fff" }}
              >
                ← Voltar
              </button>
            </div>

          </div>
        </div>
      </main>

      <FooterSonara />
    </div>
  );
}