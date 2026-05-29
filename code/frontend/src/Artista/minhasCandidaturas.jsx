import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./minhasCandidaturas.css";
import Header from "./header";
import FooterSonara from "./footer";
import {
  buscarMinhasCandidaturas,
  aceitarContraProposta,
  recusarContraProposta,
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

      if (!usuario) {
        navigate("/");
        return;
      }

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

      const listaFormatada = lista.map((c) => ({
        ...c,
        status: c.status_nome || c.status,
      }));

      setCandidaturas(listaFormatada);
    } catch (err) {
      console.error("Erro ao carregar candidaturas:", err);
      setErro("Não foi possível carregar suas candidaturas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResponder(idCandidatura, decisao) {
    const confirmacao =
      decisao === "aceitar"
        ? "Tem certeza que deseja ACEITAR esta proposta? Você será confirmado no evento."
        : "Tem certeza que deseja RECUSAR esta proposta?";

    if (!window.confirm(confirmacao)) return;

    try {
      if (decisao === "aceitar") {
        await aceitarContraProposta(idCandidatura);
        alert("Proposta aceita! Você está confirmado no evento.");
      } else {
        await recusarContraProposta(idCandidatura);
        alert("Proposta recusada.");
      }

      carregarCandidaturas();
    } catch (err) {
      alert(err.message || "Erro ao responder proposta.");
    }
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

  function formatarData(dataISO) {
    if (!dataISO) return "Data não informada";
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="meus-eventos-page">
      <Header />

      <main className="meus-eventos-main meus-eventos-main--visible">
        <h2 className="meus-eventos-titulo">Minhas Candidaturas</h2>

        {loading && (
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Carregando candidaturas...
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

        {!loading && candidaturas.length > 0 && (
          <div className="candidaturas-grid">
            {candidaturas.map((cand) => {
              const statusInfo = getStatusLabel(cand.status);

              return (
                <div key={cand.id_evento_artista} className="candidatura-card">
                  <div className="candidatura-header">
                    <h3>
                      {cand.nome_evento || cand.evento_nome || "Evento"}
                    </h3>
                    <span className={`status-badge ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="candidatura-info">
                    <p className="candidatura-data">
                      📅 {formatarData(cand.data_evento)}
                    </p>

                    {cand.local && (
                      <p className="candidatura-local">📍 {cand.local}</p>
                    )}

                    <div className="candidatura-cache">
                      <label>Cachê Esperado:</label>
                      <span>
                        R${" "}
                        {Number(cand.cache_esperado).toLocaleString("pt-BR")}
                      </span>
                    </div>

                    {cand.cache_ofertado > 0 && (
                      <div className="candidatura-cache contraproposta">
                        <label>Contraproposta recebida:</label>
                        <span>
                          R${" "}
                          {Number(cand.cache_ofertado).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="candidatura-acoes">
                    {cand.status === "Contra proposta" && (
                      <>
                        <button
                          className="btn-aceitar"
                          onClick={() =>
                            handleResponder(cand.id_evento_artista, "aceitar")
                          }
                        >
                          ✓ Aceitar
                        </button>
                        <button
                          className="btn-recusar"
                          onClick={() =>
                            handleResponder(cand.id_evento_artista, "recusar")
                          }
                        >
                          ✕ Recusar
                        </button>
                      </>
                    )}

                    {cand.status === "Pendente" && (
                      <span className="aguardando">
                        Aguardando análise do organizador...
                      </span>
                    )}

                    {cand.status === "Aprovado" && (
                      <span className="confirmado">
                        Você está confirmado! ✓
                      </span>
                    )}

                    {cand.status === "Reprovado" && (
                      <span className="reprovado">
                        Não aprovado nesta vez
                      </span>
                    )}

                    {cand.status === "Contra proposta aceita" && (
                      <span className="confirmado">
                        Proposta aceita — Confirmado ✓
                      </span>
                    )}

                    {cand.status === "Contra proposta recusada" && (
                      <span className="reprovado">Proposta recusada</span>
                    )}
                  </div>

                  <button
                    className="btn-ver-evento"
                    onClick={() =>
                      navigate(`/sobreEvento/${cand.evento_id}`)
                    }
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