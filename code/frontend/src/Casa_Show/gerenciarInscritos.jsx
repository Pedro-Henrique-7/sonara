import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./contratarArtista.css";
import HeaderCasaShow from "./headerCasaShow.jsx";
import FooterSonara from "../Artista/footer.jsx";
import {
  buscarInscricoesPorEvento,
  aprovarArtistaEvento,
  reprovarArtistaEvento,
  enviarContraProposta,
} from "../services/eventoArtistaSevice.js";

export default function GerenciarInscritos() {
  const { idEvento } = useParams();
  const navigate = useNavigate();

  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [eventoNome, setEventoNome] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [artistaSelecionado, setArtistaSelecionado] = useState(null);
  const [novaProposta, setNovaProposta] = useState("");

  useEffect(() => {
    carregarInscritos();
  }, [idEvento]);

  async function carregarInscritos() {
    try {
      setLoading(true);
      setErro(null);

      const response = await buscarInscricoesPorEvento(idEvento);

      const dados = response?.response?.Inscricoes || response?.response || response;

      if (Array.isArray(dados)) {
        const dadosFormatados = dados.map((d) => ({
          ...d,
          status: d.status_nome || d.status,
        }));

        setInscritos(dadosFormatados);

        if (dadosFormatados.length > 0) {
          setEventoNome(dadosFormatados[0].nome_evento || dadosFormatados[0].evento_nome || "");
        }
      } else {
        setInscritos([]);
      }
    } catch (err) {
      console.error("Erro ao carregar inscritos:", err);
      setErro("Não foi possível carregar as inscrições.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAprovar(idInscricao) {
    if (!window.confirm("Tem certeza que deseja aprovar este artista?")) return;

    try {
      await aprovarArtistaEvento(idInscricao);
      alert("Artista aprovado com sucesso!");
      carregarInscritos();
    } catch (err) {
      alert(err.message || "Erro ao aprovar artista.");
    }
  }

  async function handleReprovar(idInscricao) {
    if (!window.confirm("Tem certeza que deseja reprovar este artista?")) return;

    try {
      await reprovarArtistaEvento(idInscricao);
      alert("Artista reprovado.");
      carregarInscritos();
    } catch (err) {
      alert(err.message || "Erro ao reprovar artista.");
    }
  }

  function abrirModalProposta(artista) {
    setArtistaSelecionado(artista);
    setNovaProposta(artista.cache_esperado || "");
    setModalAberto(true);
  }

  async function handleEnviarProposta() {
    if (!novaProposta || Number(novaProposta) <= 0) {
      alert("Informe um valor válido para o cachê.");
      return;
    }

    try {
      await enviarContraProposta(artistaSelecionado.id_evento_artista, Number(novaProposta));
      alert("Contra-proposta enviada com sucesso!");
      setModalAberto(false);
      carregarInscritos();
    } catch (err) {
      alert(err.message || "Erro ao enviar contra-proposta.");
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
        return { label: status, class: "" };
    }
  }

  return (
    <div className="sonaraContratarPagina">
      <HeaderCasaShow />

      <div className="gerenciar-header">
        <h1 className="sonaraContratarTitulo">
          {eventoNome ? `Inscritos - ${eventoNome}` : "Gerenciar Inscritos"}
        </h1>
        <button
          className="btn-voltar"
          onClick={() => navigate("/listaMeusEventos")}
        >
          ← Voltar
        </button>
      </div>

      <main className="sonaraContratarConteudo">
        {loading && (
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Carregando inscritos...</p>
        )}

        {erro && (
          <p style={{ color: "#ffb3a7", marginBottom: "1rem" }}>{erro}</p>
        )}

        {!loading && !erro && inscritos.length === 0 && (
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              paddingTop: "4rem",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Nenhum artista se candidatou ainda.
            </p>
          </div>
        )}

        {!loading && inscritos.length > 0 && (
          <div className="inscritos-grid">
            {inscritos.map((inscricao) => {
              const statusInfo = getStatusLabel(inscricao.status);

              return (
                <div key={inscricao.id_evento_artista} className="inscrito-card">
                  <div className="inscrito-header">
                    <div className="inscrito-foto"></div>
                    <div className="inscrito-info">
                      <h3>{inscricao.nome_artistico || inscricao.artista_nome || "Artista"}</h3>
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="inscrito-conteudo">
                    <div className="inscrito-campo">
                      <label>Cachê Esperado:</label>
                      <span>R$ {Number(inscricao.cache_esperado).toLocaleString("pt-BR")}</span>
                    </div>

                    {inscricao.cache_ofertado > 0 && (
                      <div className="inscrito-campo contraproposta">
                        <label>Contraproposta Enviada:</label>
                        <span>R$ {Number(inscricao.cache_ofertado).toLocaleString("pt-BR")}</span>
                      </div>
                    )}

                    <div className="inscrito-campo">
                      <label>Sobre o Artista:</label>
                      <p>{inscricao.sobre_artista || "Sem descrição"}</p>
                    </div>

                    <div className="inscrito-campo">
                      <label>Motivo da Inscrição:</label>
                      <p>{inscricao.motivo_inscricao || "Sem descrição"}</p>
                    </div>
                  </div>

                  <div className="inscrito-acoes">
                    {inscricao.status === "Pendente" && (
                      <>
                        <button
                          className="btn-aprovar"
                          onClick={() => handleAprovar(inscricao.id_evento_artista)}
                        >
                          Aprovar
                        </button>
                        <button
                          className="btn-reprovar"
                          onClick={() => handleReprovar(inscricao.id_evento_artista)}
                        >
                          Reprovar
                        </button>
                        <button
                          className="btn-proposta"
                          onClick={() => abrirModalProposta(inscricao)}
                        >
                          Fazer Proposta
                        </button>
                      </>
                    )}

                    {inscricao.status === "Contra proposta" && (
                      <span className="aguardando-resposta">
                        Aguardando resposta do artista...
                      </span>
                    )}

                    {inscricao.status === "Aprovado" && (
                      <span className="confirmado">Artista Confirmado ✓</span>
                    )}

                    {inscricao.status === "Reprovado" && (
                      <span className="reprovado">Não aprovado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h3>Enviar Contra-Proposta</h3>

            <p className="modal-artista">
              Para: <strong>{artistaSelecionado?.nome_artistico || artistaSelecionado?.artista_nome}</strong>
            </p>

            <div className="modal-campo">
              <label htmlFor="cache-proposta">Novo valor do cachê (R$)</label>
              <input
                id="cache-proposta"
                type="number"
                min="1"
                value={novaProposta}
                onChange={(e) => setNovaProposta(e.target.value)}
                placeholder="Ex: 1500"
              />
            </div>

            <div className="modal-acoes">
              <button className="btn-cancelar" onClick={() => setModalAberto(false)}>
                Cancelar
              </button>
              <button className="btn-enviar" onClick={handleEnviarProposta}>
                Enviar Proposta
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterSonara />
    </div>
  );
}