import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./minhasCandidaturas.css";
import Header from "./header";
import FooterSonara from "./footer";
import {
  buscarMinhasCandidaturas,
  aceitarContraProposta,
  recusarContraProposta,
  aceitarConvite,
  recusarConvite,
} from "../services/eventoArtistaSevice.js";

export default function MinhasCandidaturas() {
  const navigate = useNavigate();
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarCandidaturas();
  }, []);

  async function carregarCandidaturas() {
    try {
      setLoading(true);
      setErro(null);

      const usuario = sessionStorage.getItem("usuario");
      if (!usuario) { navigate("/"); return; }

      const u = JSON.parse(usuario);
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

      setCandidaturas(lista.map((c) => ({
        ...c,
        status: c.status_nome || c.status,
      })));
    } catch (err) {
      console.error("Erro ao carregar candidaturas:", err);
      setErro("Não foi possível carregar suas candidaturas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResponder(idCandidatura, decisao) {
    const msg =
      decisao === "aceitar" || decisao === "aceitar-convite"
        ? "Tem certeza que deseja ACEITAR?"
        : "Tem certeza que deseja RECUSAR?";
    if (!window.confirm(msg)) return;

    try {
      if (decisao === "aceitar") {
        await aceitarContraProposta(idCandidatura);
        alert("Proposta aceita! Você está confirmado no evento.");
      } else if (decisao === "recusar") {
        await recusarContraProposta(idCandidatura);
        alert("Proposta recusada.");
      } else if (decisao === "aceitar-convite") {
        await aceitarConvite(idCandidatura);
        alert("Convite aceito! Você está confirmado no evento.");
      } else if (decisao === "recusar-convite") {
        await recusarConvite(idCandidatura);
        alert("Convite recusado.");
      }
      carregarCandidaturas();
    } catch (err) {
      alert(err.message || "Erro ao responder.");
    }
  }

  function getStatusInfo(status) {
    switch (status) {
      case "Pendente":                 return { label: "Pendente",          cls: "status-pendente" };
      case "Aprovado":                 return { label: "Aprovado",          cls: "status-aprovado" };
      case "Reprovado":                return { label: "Reprovado",         cls: "status-reprovado" };
      case "Contra proposta":          return { label: "Contraproposta",    cls: "status-contraproposta" };
      case "Contra proposta aceita":   return { label: "Aceito",            cls: "status-aceito" };
      case "Contra proposta recusada": return { label: "Recusado",          cls: "status-recusado" };
      case "Convite pendente":         return { label: "Convite recebido",  cls: "status-convite" };
      case "Convite aceito":           return { label: "Confirmado",        cls: "status-aprovado" };
      case "Convite recusado":         return { label: "Recusado",          cls: "status-reprovado" };
      default: return { label: status || "—", cls: "" };
    }
  }

  function formatarData(dataISO) {
    if (!dataISO) return null;
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    });
  }

  function formatarMoeda(valor) {
    const num = Number(valor);
    if (!valor || isNaN(num)) return "—";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function temContraProposta(cand) {
    return cand.contra_proposta && Number(cand.contra_proposta) > 0;
  }

  function isConviteOrganizador(cand) {
    return cand.motivo_inscricao === "Proposta enviada pelo organizador";
  }

  return (
    <div className="meus-eventos-page">
      <Header />

      <main className="meus-eventos-main meus-eventos-main--visible">
        <h2 className="meus-eventos-titulo">Minhas Candidaturas</h2>

        {loading && (
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Carregando candidaturas...</p>
        )}

        {erro && (
          <p style={{ color: "#ffb3a7", marginBottom: "1rem" }}>{erro}</p>
        )}

        {!loading && !erro && candidaturas.length === 0 && (
          <div style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", paddingTop: "4rem" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Você ainda não se candidatou a nenhum evento.
            </p>
            <button
              onClick={() => navigate("/shows")}
              style={{
                background: "linear-gradient(135deg,#f4511e,#ff7a1a)",
                border: "none", borderRadius: "999px", color: "#fff",
                padding: "0.8rem 2rem", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              Ver eventos disponíveis
            </button>
          </div>
        )}

        {!loading && candidaturas.length > 0 && (
          <div className="candidaturas-grid">
            {candidaturas.map((cand) => {
              const { label, cls } = getStatusInfo(cand.status);
              const dataStatus = formatarData(cand.status_data_hora);
              const ehConvite = isConviteOrganizador(cand);

              return (
                <div
                  key={cand.id_evento_artista}
                  className={`candidatura-card ${ehConvite ? "candidatura-card--convite" : ""}`}
                >
                  {/* Banner de convite */}
                  {ehConvite && (
                    <div className="banner-proposta-recebida">
                      📩 Proposta recebida do organizador
                    </div>
                  )}

                  {/* Cabeçalho */}
                  <div className="candidatura-header">
                    <h3>Evento #{cand.evento_nome}</h3>
                    <span className={`status-badge ${cls}`}>{label}</span>
                  </div>

                  {/* Infos */}
                  <div className="candidatura-info">
                    {dataStatus && (
                      <p className="candidatura-data">
                        🕐 Atualizado em {dataStatus}
                      </p>
                    )}

                    {(cand.cidade || cand.estado) && (
                      <p className="candidatura-local">
                        📍 {[cand.cidade, cand.estado].filter(Boolean).join(", ")}
                      </p>
                    )}

                    <div className="candidatura-cache">
                      <label>Cachê esperado:</label>
                      <span>{formatarMoeda(cand.cache_esperado)}</span>
                    </div>

                    {temContraProposta(cand) && (
                      <div className="candidatura-cache contraproposta">
                        <label>Contraproposta recebida:</label>
                        <span>{formatarMoeda(cand.contra_proposta)}</span>
                      </div>
                    )}

                    {cand.cache_final && Number(cand.cache_final) > 0 && (
                      <div className="candidatura-cache cache-final">
                        <label>Cachê final acordado:</label>
                        <span>{formatarMoeda(cand.cache_final)}</span>
                      </div>
                    )}

                    {cand.sobre_artista && (
                      <div className="candidatura-cache">
                        <label>Sobre você:</label>
                        <span style={{ fontWeight: 400, opacity: 0.85 }}>{cand.sobre_artista}</span>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="candidatura-acoes">

                    {/* Contraproposta do organizador */}
                    {cand.status === "Contra proposta" && (
                      <>
                        <button
                          className="btn-aceitar"
                          onClick={() => handleResponder(cand.id_evento_artista, "aceitar")}
                        >
                          ✓ Aceitar
                        </button>
                        <button
                          className="btn-recusar"
                          onClick={() => handleResponder(cand.id_evento_artista, "recusar")}
                        >
                          ✕ Recusar
                        </button>
                      </>
                    )}

                    {/* Pendente: diferencia convite do organizador de candidatura normal */}
                    {cand.status === "Pendente" && (
                      ehConvite ? (
                        <>
                          <button
                            className="btn-aceitar"
                            onClick={() => handleResponder(cand.id_evento_artista, "aceitar-convite")}
                          >
                            ✓ Aceitar convite
                          </button>
                          <button
                            className="btn-recusar"
                            onClick={() => handleResponder(cand.id_evento_artista, "recusar-convite")}
                          >
                            ✕ Recusar convite
                          </button>
                        </>
                      ) : (
                        <span className="aguardando">Aguardando análise do organizador...</span>
                      )
                    )}

                    {/* Convite com status próprio (caso o backend implemente) */}
                    {cand.status === "Convite pendente" && (
                      <>
                        <button
                          className="btn-aceitar"
                          onClick={() => handleResponder(cand.id_evento_artista, "aceitar-convite")}
                        >
                          ✓ Aceitar convite
                        </button>
                        <button
                          className="btn-recusar"
                          onClick={() => handleResponder(cand.id_evento_artista, "recusar-convite")}
                        >
                          ✕ Recusar convite
                        </button>
                      </>
                    )}

                    {cand.status === "Aprovado" && (
                      <span className="confirmado">Você está confirmado! ✓</span>
                    )}

                    {cand.status === "Reprovado" && (
                      <span className="reprovado">Não aprovado nesta vez</span>
                    )}

                    {cand.status === "Contra proposta aceita" && (
                      <span className="confirmado">Proposta aceita — Confirmado ✓</span>
                    )}

                    {cand.status === "Contra proposta recusada" && (
                      <span className="reprovado">Proposta recusada</span>
                    )}

                    {cand.status === "Convite aceito" && (
                      <span className="confirmado">Convite aceito — Confirmado ✓</span>
                    )}

                    {cand.status === "Convite recusado" && (
                      <span className="reprovado">Convite recusado</span>
                    )}

                    {cand.status === "Desconhecido" && (
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>
                        Status não disponível
                      </span>
                    )}
                  </div>

                  <button
                    className="btn-ver-evento"
                    onClick={() => navigate(`/sobreEvento/${cand.evento_id}`)}
                  >
                    Ver detalhes do evento
                  </button>
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