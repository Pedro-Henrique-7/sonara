import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./meusEventos.css";
import Header from "./header";
import FooterSonara from "./footer";
import { buscarMinhasCandidaturas } from "../services/eventoArtistaSevice.js";

const PLACEHOLDER_IMG =
  "https://placehold.co/600x300/1a1a2e/ffffff?text=Sem+Foto";

function formatarData(dataISO) {
  if (!dataISO) return "Data não informada";
  return new Date(dataISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getStatusLabel(status) {
  switch (status) {
    case "Pendente":
      return { label: "Pendente", class: "status-pendente" };
    case "Aprovado":
      return { label: "Aprovado", class: "status-aprovado" };
    case "Reprovado":
      return { label: "Reprovado", class: "status-reprovado" };
    case "Contra proposta":
      return { label: "Contraproposta", class: "status-contraproposta" };
    case "Contra proposta aceita":
      return { label: "Aceito", class: "status-aceito" };
    case "Contra proposta recusada":
      return { label: "Recusado", class: "status-recusado" };
    default:
      return { label: status || "—", class: "" };
  }
}

export default function MeusEventos() {
  const navigate = useNavigate();
  const location = useLocation();

  const [visible, setVisible] = useState(false);
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    carregarCandidaturas();
  }, [location.pathname]);

  async function carregarCandidaturas() {
    try {
      setLoading(true);
      setErro("");

      const usuarioSalvo = sessionStorage.getItem("usuario");

      if (!usuarioSalvo) {
        navigate("/login");
        return;
      }

      const u = JSON.parse(usuarioSalvo);
      const artistaId =
        u.id_artista || u.artista?.id_artista || u.Artista?.id_artista;

      if (!artistaId) {
        setErro("Perfil de artista não encontrado.");
        setLoading(false);
        return;
      }

      const response = await buscarMinhasCandidaturas(artistaId);

      const dados =
        response?.response?.Candidaturas ||
        response?.response?.Inscricoes ||
        response?.response ||
        response;

      const lista = Array.isArray(dados) ? dados : [];

      const listaFormatada = lista.map((c) => ({
        ...c,
        status: c.status_nome || c.status,
      }));

      setCandidaturas(listaFormatada);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar seus eventos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="meus-eventos-page">
      <Header />

      <main
        className={`meus-eventos-main ${
          visible ? "meus-eventos-main--visible" : ""
        }`}
      >
        <h2 className="meus-eventos-titulo">Meus Eventos</h2>

        {loading && (
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Carregando eventos...
          </p>
        )}

        {erro && (
          <p style={{ color: "#ffb3a7", marginBottom: "1rem" }}>{erro}</p>
        )}

        {!loading && !erro && candidaturas.length === 0 && (
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              paddingTop: "4rem",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Você ainda não se candidatou a nenhum evento.
            </p>

            <button
              onClick={() => navigate("/shows")}
              style={{
                background: "linear-gradient(135deg,#f4511e,#ff7a1a)",
                border: "none",
                borderRadius: "999px",
                color: "#fff",
                padding: "0.8rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Ver eventos disponíveis
            </button>
          </div>
        )}

        {!loading && !erro && candidaturas.length > 0 && (
          <div className="meus-eventos-grid">
            {candidaturas.map((cand, index) => {
              const statusInfo = getStatusLabel(cand.status);

              return (
                <div
                  key={cand.id_evento_artista ?? index}
                  className="evento-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="evento-imagem-wrapper">
                    <img
                      src={
                        cand.fotos?.[0]?.url ||
                        cand.url_foto ||
                        PLACEHOLDER_IMG
                      }
                      alt={cand.nome_evento || "Evento"}
                      className="evento-imagem"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMG;
                      }}
                    />
                  </div>

                  <div className="evento-detalhes-card">
                    <div className="evento-detalhes-campo">
                      <label className="evento-detalhes-label">
                        Nome do evento
                      </label>
                      <div className="evento-detalhes-input">
                        {cand.nome_evento || cand.evento_nome || "—"}
                      </div>
                    </div>

                    <div className="evento-detalhes-row">
                      <div className="evento-detalhes-campo">
                        <label className="evento-detalhes-label">DATA</label>
                        <div className="evento-detalhes-input evento-detalhes-input--small">
                          {formatarData(cand.data_evento)}
                        </div>
                      </div>

                      {cand.local && (
                        <div className="evento-detalhes-campo">
                          <label className="evento-detalhes-label">
                            LOCAL
                          </label>
                          <div className="evento-detalhes-input evento-detalhes-input--small">
                            {cand.local}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="evento-cache-card">
                      <div className="evento-cache-campo">
                        <label className="evento-cache-label">
                          Cachê Esperado
                        </label>
                        <div className="evento-cache-input">
                          R${" "}
                          {Number(cand.cache_esperado).toLocaleString("pt-BR")}
                        </div>
                      </div>

                      {cand.cache_ofertado > 0 && (
                        <div className="evento-cache-campo">
                          <label className="evento-cache-label">
                            Cachê Ofertado
                          </label>
                          <div className="evento-cache-input">
                            R${" "}
                            {Number(cand.cache_ofertado).toLocaleString(
                              "pt-BR"
                            )}
                          </div>
                        </div>
                      )}

                      <div className="evento-cache-campo">
                        <label className="evento-cache-label">Status</label>
                        <div
                          className={`evento-cache-input status-badge ${statusInfo.class}`}
                        >
                          {statusInfo.label}
                        </div>
                      </div>
                    </div>

                    <div className="evento-cache-actions">
                      <button
                        className="evento-btn-ver"
                        onClick={() =>
                          navigate(`/sobreEvento/${cand.evento_id}`)
                        }
                      >
                        Ver Evento
                      </button>

                      <button
                        className="evento-btn-ver"
                        onClick={() => navigate("/minhasCandidaturas")}
                        style={{ background: "rgba(255,255,255,0.15)" }}
                      >
                        Ver Candidaturas
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <FooterSonara />
    </div>
  );
}