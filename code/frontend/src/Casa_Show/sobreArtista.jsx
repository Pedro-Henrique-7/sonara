import "./sobreArtista.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import StarRating from "../components/starRating";

import HeaderCasaShow from "./headerCasaShow";
import FooterSonara from "../Artista/footer";

import {
  avaliarArtista,
  buscarAvaliacaoArtista,
  atualizarAvaliacaoArtista,
} from "../services/avaliacaoService";

import {
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import { candidatarArtista } from "../services/eventoArtistaSevice.js";

export default function SobreArtista() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const artista = state?.artista;

  const usuarioSalvo = sessionStorage.getItem("usuario")
    ? JSON.parse(sessionStorage.getItem("usuario"))
    : null;

  const eventos = usuarioSalvo?.organizador?.eventos || [];

  // Modal de proposta
  const [abrirProposta, setAbrirProposta] = useState(false);
  const [eventoId, setEventoId] = useState("");
  const [valorProposta, setValorProposta] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroProposta, setErroProposta] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // Sem artista na navegação
  if (!artista) {
    return (
      <div className="sonaraSobreArtistaPagina">
        <HeaderCasaShow />

        <main style={{ textAlign: "center", padding: "4rem", color: "white" }}>
          <p>Artista não encontrado.</p>

          <button
            className="sonaraSobreArtistaBtn"
            style={{ marginTop: "1rem", maxWidth: 200 }}
            onClick={() => navigate("/contratarArtista")}
          >
            Voltar
          </button>
        </main>

        <FooterSonara />
      </div>
    );
  }

  const generos = Array.isArray(artista.generos_musicais)
    ? artista.generos_musicais
        .map((g) => g.nome)
        .filter(Boolean)
        .join(" & ")
    : "";

  const redes = Array.isArray(artista.redes_sociais)
    ? artista.redes_sociais
    : [];

  function iconeRede(tipo) {
    switch (tipo?.toLowerCase()) {
      case "instagram":
        return <FaInstagram />;

      case "youtube":
        return <FaYoutube />;

      case "twitter":
      case "x":
        return <FaXTwitter />;

      default:
        return null;
    }
  }

  function renderEstrelas(media) {
    const arredondado = Math.round(Number(media) || 0);

    return [1, 2, 3, 4, 5].map((i) => (
      <FaStar
        key={i}
        className={i > arredondado ? "sonaraSobreArtistaStarOff" : ""}
      />
    ));
  }

  function formatarMoeda(valor) {
    const apenasDigitos = valor.replace(/\D/g, "");

    if (!apenasDigitos) return "";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseInt(apenasDigitos, 10) / 100);
  }

  function handleValorChange(e) {
    setValorProposta(formatarMoeda(e.target.value));
    setErroProposta("");
  }

  function handleValorKeyDown(e) {
    const permitidos = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];

    if (permitidos.includes(e.key)) return;

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  // Converte "R$ 1.500,00" → 1500
  function parseMoeda(str) {
    const limpo = str.replace(/[R$\s.]/g, "").replace(",", ".");
    return parseFloat(limpo) || 0;
  }

  async function handleEnviarProposta() {
    if (!eventoId) {
      return setErroProposta("Selecione um evento.");
    }

    const valor = parseMoeda(valorProposta);

    if (!valor || valor <= 0) {
      return setErroProposta("Informe um cachê válido.");
    }

    if (!mensagem.trim()) {
      return setErroProposta("Escreva uma mensagem para o artista.");
    }

    setEnviando(true);
    setErroProposta("");

    try {
      await candidatarArtista({
        evento_id: Number(eventoId),
        artista_id: artista.artista_id,
        cache_ofertado: 1500,
        sobre_artista: mensagem,
        cache_esperado: valor,
        motivo_inscricao: "Proposta enviada pelo organizador",
      });

      setSucesso(true);

      setAbrirProposta(false);
      setValorProposta("");
      setMensagem("");
      setEventoId("");
    } catch (err) {
      setErroProposta(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleAvaliarArtista(nota, avaliacaoId) {
    if (avaliacaoId) {
      await atualizarAvaliacaoArtista({
        id: avaliacaoId,
        numero_estrelas: nota,
        usuario_id: usuarioSalvo.id_usuario,
        artista_id: Number(artista.artista_id),
      });
    } else {
      await avaliarArtista({
        numero_estrelas: nota,
        usuario_id: usuarioSalvo.id_usuario,
        artista_id: Number(artista.artista_id),
      });
    }
  }

  return (
    <>
      <HeaderCasaShow />

      <main className="sonaraSobreArtistaPagina">
        <div className="sonaraSobreArtistaContainer">
          <div className="sonaraSobreArtistaCabecalho">
            <button
              className="sonaraSobreArtistaVoltar"
              onClick={() => navigate("/contratarArtista")}
            >
              <FaArrowLeft />
              Voltar
            </button>

            <h1 className="sonaraSobreArtistaTitulo">Ver Artista</h1>
          </div>

          {sucesso && (
            <div className="sonaraSobreArtistaSucesso">
              ✓ Proposta enviada com sucesso! O artista receberá a solicitação.
            </div>
          )}

          <div className="sonaraSobreArtistaCard">
            {/* TOPO */}
            <div className="sonaraSobreArtistaTopo">
              <div className="sonaraSobreArtistaFotoArea">
                {artista.foto ? (
                  <img
                    src={artista.foto}
                    alt={artista.nome_artistico}
                    className="sonaraSobreArtistaFoto"
                  />
                ) : (
                  <div className="sonaraSobreArtistaFoto sonaraSobreArtistaFotoPlaceholder">
                    {artista.nome_artistico?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="sonaraSobreArtistaInfo">
                <h2>{artista.nome_artistico}</h2>

                {generos && <span>{generos}</span>}

                {artista.telefone && <p>{artista.telefone}</p>}

                {/* AVALIAR */}
                <div className="sonaraSobreArtistaAvaliacao">
                  <StarRating
                    onRate={handleAvaliarArtista}
                    mediaAtual={artista?.media_avaliacao_artista || 0}
                    totalAvaliacoes={artista?.total_avaliacoes_artista || 0}
                    usuario_id={usuarioSalvo?.id_usuario}
                    entityId={Number(artista.artista_id)}
                    buscarAvaliacao={buscarAvaliacaoArtista}
                  />
                </div>
              </div>
            </div>

            {/* LOCAL */}
            {(artista.cidade || artista.estado) && (
              <div className="sonaraSobreArtistaLocal">
                <FaMapMarkerAlt className="sonaraSobreArtistaLocalIcone" />

                <p>
                  {[artista.cidade, artista.estado].filter(Boolean).join(", ")}
                </p>
              </div>
            )}

            {/* DESCRIÇÃO */}
            {artista.descricao_artista && (
              <div className="sonaraSobreArtistaDescricao">
                <p>{artista.descricao_artista}</p>
              </div>
            )}

            {/* RODAPÉ */}
            <div className="sonaraSobreArtistaRodapeInfo">
              {artista.cache_esperado > 0 && (
                <div className="sonaraSobreArtistaCache">
                  <h3>Cachê Pretendido:</h3>

                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(artista.cache_esperado)}
                  </span>
                </div>
              )}

              {redes.length > 0 && (
                <div className="sonaraSobreArtistaRedes">
                  {redes.map((rede) => {
                    const icone = iconeRede(rede.tipo);

                    return icone ? (
                      <a
                        key={rede.id_redes_sociais ?? rede.id}
                        href={rede.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {icone}
                      </a>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* BOTÃO */}
            <div className="sonaraSobreArtistaBotoes">
              <button
                className="sonaraSobreArtistaBtn"
                onClick={() => setAbrirProposta(true)}
              >
                Fazer Proposta
              </button>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {abrirProposta && (
          <div className="sonaraModalOverlay">
            <div className="sonaraModal">
              <h2>Fazer Proposta</h2>

              <p className="sonaraModalArtistaNome">
                Para:
                <strong>{artista.nome_artistico}</strong>
              </p>

              {/* EVENTO */}
              <div className="sonaraModalCampo">
                <label>Evento</label>

                <select
                  className="sonaraModalInput"
                  value={eventoId}
                  onChange={(e) => {
                    setEventoId(e.target.value);
                    setErroProposta("");
                  }}
                >
                  <option value="">Selecione um evento</option>

                  {eventos.map((ev) => (
                    <option key={ev.id_evento} value={ev.id_evento}>
                      {ev.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* CACHÊ */}
              <div className="sonaraModalCampo">
                <label>Cachê oferecido</label>

                <input
                  type="text"
                  placeholder="R$ 0,00"
                  inputMode="numeric"
                  className="sonaraModalInput"
                  value={valorProposta}
                  onChange={handleValorChange}
                  onKeyDown={handleValorKeyDown}
                />
              </div>

              {/* MENSAGEM */}
              <div className="sonaraModalCampo">
                <label>Mensagem</label>

                <textarea
                  placeholder="Conte sobre o evento, data, expectativas..."
                  className="sonaraModalTextarea"
                  value={mensagem}
                  onChange={(e) => {
                    setMensagem(e.target.value);
                    setErroProposta("");
                  }}
                />
              </div>

              {erroProposta && (
                <p className="sonaraModalErro">{erroProposta}</p>
              )}

              <div className="sonaraModalBotoes">
                <button
                  className="sonaraModalCancelar"
                  onClick={() => {
                    setAbrirProposta(false);
                    setErroProposta("");
                  }}
                >
                  Cancelar
                </button>

                <button
                  className="sonaraModalEnviar"
                  onClick={handleEnviarProposta}
                  disabled={enviando}
                >
                  {enviando ? "Enviando..." : "Enviar Proposta"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <FooterSonara />
    </>
  );
}
