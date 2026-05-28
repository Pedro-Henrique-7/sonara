import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./eventoInscricao.css";
import Header from "./header";
import FooterSonara from "./footer";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function EventoInscricao() {
  const { idEvento } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const [form, setForm] = useState({
    sobre_artista: "",
    motivo_inscricao: "",
    cache_esperado: "",
  });

  // Busca dados do evento para exibir o nome/contexto
  useEffect(() => {
    if (!idEvento) return;

    fetch(`${BASE_URL}/evento/${idEvento}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status_code === 200) {
          setEvento(data.response.evento);
        }
      })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [idEvento]);

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function validar() {
    if (!form.sobre_artista.trim())
      return "Conte um pouco sobre você.";
    if (form.sobre_artista.length > 500)
      return "Limite de 500 caracteres para a apresentação.";
    if (!form.motivo_inscricao.trim())
      return "Informe por que quer participar.";
    if (form.motivo_inscricao.length > 500)
      return "Limite de 500 caracteres para o motivo.";
    if (!form.cache_esperado || isNaN(Number(form.cache_esperado)) || Number(form.cache_esperado) < 0)
      return "Informe um cachê válido (pode ser 0).";
    return null;
  }

  async function handleCandidatar() {
    const erroValidacao = validar();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setEnviando(true);
    setErro("");

    try {
      const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
      const artistaId = usuario?.artista?.id_artista;
      const token = sessionStorage.getItem("token");

      if (!artistaId) {
        setErro("Perfil de artista não encontrado. Faça login novamente.");
        setEnviando(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/eventoArtista/candidatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          artista_id: artistaId,
          evento_id: Number(idEvento),
          cache_esperado: Number(form.cache_esperado),
          sobre_artista: form.sobre_artista,
          motivo_inscricao: form.motivo_inscricao,
        }),
      });

      const data = await response.json();

      if (data.status_code === 201) {
        setSucesso(true);
      } else {
        setErro(data.message || "Erro ao enviar candidatura.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setEnviando(false);
    }
  }

  // ── Tela de sucesso ───────────────────────────────────────────────────────
  if (sucesso) {
    return (
      <div className="pa-wrapper">
        <Header />
        <main className="main-central">
          <div className="card-inscricao card-sucesso">
            <div className="sucesso-icone">✓</div>
            <h2 className="sucesso-titulo">Candidatura enviada!</h2>
            <p className="sucesso-desc">
              Sua candidatura foi registrada com status <strong>Pendente</strong>.
              O organizador irá analisá-la em breve.
            </p>
            <div className="sucesso-acoes">
              <button
                className="btn-inscricao btn-secundario"
                onClick={() => navigate(`/sobreEvento/${idEvento}`)}
              >
                Voltar ao evento
              </button>
              <button
                className="btn-inscricao"
                onClick={() => navigate("/perfil")}
              >
                Ver meu perfil
              </button>
            </div>
          </div>
        </main>
        <FooterSonara />
      </div>
    );
  }

  return (
    <div className="pa-wrapper">
      <Header />
      <main className="main-central">
        <div className="card-inscricao">

          {/* Nome do evento no topo */}
          {!carregando && evento && (
            <div className="inscricao-evento-info">
              <span className="inscricao-label-evento">Candidatando-se para</span>
              <h2 className="inscricao-nome-evento">{evento.nome}</h2>
              <p className="inscricao-data-evento">
                {evento.data
                  ? new Date(evento.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
                {evento.local ? ` — ${evento.local}` : ""}
              </p>
            </div>
          )}

          {/* Campo: sobre o artista */}
          <div className="campo">
            <label htmlFor="sobre_artista">
              Conte sobre você
              <span className="campo-counter">{form.sobre_artista.length}/500</span>
            </label>
            <textarea
              id="sobre_artista"
              placeholder="Seu estilo, experiência, conquistas..."
              value={form.sobre_artista}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          {/* Campo: motivo */}
          <div className="campo">
            <label htmlFor="motivo_inscricao">
              Por que você deveria cantar aqui?
              <span className="campo-counter">{form.motivo_inscricao.length}/500</span>
            </label>
            <textarea
              id="motivo_inscricao"
              placeholder="O que te conecta a este evento?"
              value={form.motivo_inscricao}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          {/* Campo: cachê */}
          <div className="campo-cache">
            <label htmlFor="cache_esperado">Cachê Pretendido (R$)</label>
            <input
              id="cache_esperado"
              type="number"
              min="0"
              placeholder="Ex: 1500"
              value={form.cache_esperado}
              onChange={handleChange}
            />
          </div>

          {/* Erro */}
          {erro && <p className="inscricao-erro">{erro}</p>}

          {/* Botões */}
          <div className="inscricao-acoes">
            <button
              className="btn-inscricao btn-secundario"
              onClick={() => navigate(-1)}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              className="btn-inscricao"
              onClick={handleCandidatar}
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Candidatar-se"}
            </button>
          </div>

        </div>
      </main>
      <FooterSonara />
    </div>
  );
}