import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./eventoInscricao.css";
import Header from "./header";
import FooterSonara from "./footer";
import { buscarEventosPorId } from "../services/eventoService";
import { candidatarArtista } from "../services/eventoArtistaSevice";

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

  useEffect(() => {
    async function carregarEvento() {
      try {
        if (!idEvento) return;

        const data = await buscarEventosPorId(idEvento);

        const ev =
          data?.response?.evento ||
          data?.response?.Evento ||
          data?.evento ||
          data;

        setEvento(ev);
      } catch (error) {
        setErro("Não foi possível carregar o evento.");
      } finally {
        setCarregando(false);
      }
    }

    carregarEvento();
  }, [idEvento]);

  function handleChange(e) {
    setErro("");
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  }

  function validar() {
    if (!form.sobre_artista.trim()) {
      return "Conte um pouco sobre você.";
    }

    if (form.sobre_artista.length > 500) {
      return "Limite de 500 caracteres para a apresentação.";
    }

    if (!form.motivo_inscricao.trim()) {
      return "Informe por que quer participar.";
    }

    if (form.motivo_inscricao.length > 500) {
      return "Limite de 500 caracteres para o motivo.";
    }

    if (
      !form.cache_esperado ||
      isNaN(Number(form.cache_esperado)) ||
      Number(form.cache_esperado) <= 0
    ) {
      return "Informe um cachê válido.";
    }

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

      const artistaId =
        usuario?.id_artista ||
        usuario?.artista?.id_artista ||
        usuario?.Artista?.id_artista;

      if (!artistaId) {
        setErro("Perfil de artista não encontrado. Faça login novamente.");
        return;
      }

      await candidatarArtista({
        artista_id: Number(artistaId),
        evento_id: Number(idEvento),
        cache_esperado: Number(form.cache_esperado),
        sobre_artista: form.sobre_artista,
        motivo_inscricao: form.motivo_inscricao,
      });

      setSucesso(true);
    } catch (error) {
      setErro(error.message || "Erro ao enviar candidatura.");
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="pa-wrapper">
        <Header />
        <main className="main-central">
          <div className="card-inscricao card-sucesso">
            <div className="sucesso-icone">✓</div>

            <h2 className="sucesso-titulo">Candidatura enviada!</h2>

            <p className="sucesso-desc">
              Sua candidatura foi registrada com status{" "}
              <strong>Pendente</strong>. O organizador irá analisá-la em breve.
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
                onClick={() => navigate("/meus-eventos")}
              >
                Minhas inscrições
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
          {!carregando && evento && (
            <div className="inscricao-evento-info">
              <span className="inscricao-label-evento">
                Candidatando-se para
              </span>

              <h2 className="inscricao-nome-evento">
                {evento.nome || evento.evento_nome || "Evento"}
              </h2>

              <p className="inscricao-data-evento">
                {evento.data || evento.data_evento
                  ? new Date(
                      evento.data || evento.data_evento,
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}

                {evento.local ? ` — ${evento.local}` : ""}
              </p>
            </div>
          )}

          <div className="campo">
            <label htmlFor="sobre_artista">
              Conte sobre você
              <span className="campo-counter">
                {form.sobre_artista.length}/500
              </span>
            </label>

            <textarea
              id="sobre_artista"
              placeholder="Seu estilo, experiência, conquistas..."
              value={form.sobre_artista}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          <div className="campo">
            <label htmlFor="motivo_inscricao">
              Por que você deveria cantar aqui?
              <span className="campo-counter">
                {form.motivo_inscricao.length}/500
              </span>
            </label>

            <textarea
              id="motivo_inscricao"
              placeholder="O que te conecta a este evento?"
              value={form.motivo_inscricao}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          <div className="campo-cache">
            <label htmlFor="cache_esperado">Cachê Pretendido (R$)</label>

            <input
              id="cache_esperado"
              type="number"
              min="1"
              placeholder="Ex: 1500"
              value={form.cache_esperado}
              onChange={handleChange}
            />
          </div>

          {erro && <p className="inscricao-erro">{erro}</p>}

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
