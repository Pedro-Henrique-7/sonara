import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import "./sobreEvento.css";
import fotoShow from "../img/fotoShow.png";
import Header from "./header";
import FooterSonara from "./footer";
import { buscarEventosPorId } from "../services/eventoService";
import StarRating from "../components/starRating"
import { avaliarEvento, buscarAvaliacaoEvento, atualizarAvaliacaoEvento } from "../services/avaliacaoService"


const PLACEHOLDER_IMG = fotoShow;

function formatarData(dataISO) {
  if (!dataISO) return "Data não informada";
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatarHora(hora) {
  if (!hora) return "--:--";
  return hora.slice(0, 5);
}

function obterImagens(fotos) {
  if (Array.isArray(fotos) && fotos.length > 0) {
    return fotos;
  }
  return [{ url: PLACEHOLDER_IMG }];
}

export default function SobreEvento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
  const isArtista = usuario?.tipo_usuario?.toLowerCase() === "artista";

  // Estrelas
  const totalEstrelas = 5;
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);

  //Imagens
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  useEffect(() => {
    async function carregarEvento() {
      try {
        if (!id) throw new Error("ID do evento não informado.");

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
      } catch (err) {
        console.error(err);
        setErro(err.message || "Não foi possível carregar o evento.");
      } finally {
        setLoading(false);
      }
    }

    carregarEvento();
  }, [id]);

  if (loading) {
    return (
      <div className="main-wrapper">
        <Header />
        <div className="loading-state">
          <h2>Carregando evento...</h2>
        </div>
        <FooterSonara />
      </div>
    );
  }

  if (erro || !evento) {
    return (
      <div className="main-wrapper">
        <Header />
        <div className="error-state">
          <h2>{erro || "Evento não encontrado."}</h2>
          <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
        <FooterSonara />
      </div>
    );
  }

  const imagens = obterImagens(evento.fotos);

  const end = evento.endereco || {};
  const enderecoCompleto = end.logradouro
    ? `${end.logradouro}, ${end.numero || "S/N"}${end.complemento ? ` - ${end.complemento}` : ""
    }, ${end.bairro || ""} - ${end.cidade || ""}/${end.estado || ""}`
    : null;

  async function handleAvaliarEvento(nota, avaliacaoId) {
    if (avaliacaoId) {
      await atualizarAvaliacaoEvento({
        id: avaliacaoId,
        numero_estrelas: nota,
        usuario_id: usuario.id_usuario,
        evento_id: Number(id),
      })
    } else {
      await avaliarEvento({
        numero_estrelas: nota,
        usuario_id: usuario.id_usuario,
        evento_id: Number(id),
      })
    }
  }



  return (
    <div className="main-wrapper">
      <Header />

      <main className="container-principal">
        {/* ESQUERDA */}
        <div className="left">
          <img
            src={imagens[imagemSelecionada]?.url}
            alt={evento.nome}
            className="main-img"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMG;
            }}
          />

          {/* AVALIAÇÃO */}
          <div className="sonaraSobreEventoAvaliacao">
            <StarRating
              onRate={handleAvaliarEvento}
              mediaAtual={evento?.avaliacao?.media || 0}
              totalAvaliacoes={evento?.avaliacao?.total || 0}
              usuario_id={usuario.id_usuario}
              entityId={Number(id)}
              buscarAvaliacao={buscarAvaliacaoEvento}
            />
          </div>
          {/* MINI IMAGENS */}
          {imagens.map((foto, i) => (
            <img
              key={i}
              src={foto.url}
              alt={`Foto ${i + 1} do evento`}
              className={imagemSelecionada === i ? "thumb active" : "thumb"}
              onClick={() => setImagemSelecionada(i)}
              onError={(e) => {
                e.target.src = PLACEHOLDER_IMG;
              }}
            />
          ))}
        </div>

        {/* DIREITA */}
        <div className="right">
          <div className="form-box">
            <section className="evento-nome">
              <label>Nome do evento</label>
              <p>{evento.nome || "Nome não informado"}</p>
            </section>

            <section className="evento-descricao">
              <label>Descrição</label>
              <p>{evento.descricao || "Sem descrição disponível."}</p>
            </section>

            <div className="evento-row">
              <section className="evento-data">
                <label>DATA</label>
                <p>{formatarData(evento.data)}</p>
              </section>

              <section className="evento-hora">
                <label>HORA</label>
                <p>
                  {formatarHora(evento.hora_inicio)}
                  {evento.hora_fim && ` - ${formatarHora(evento.hora_fim)}`}
                </p>
              </section>
            </div>

            {(evento.local || enderecoCompleto) && (
              <section className="evento-local">
                <label>Local</label>
                {evento.local && <p>{evento.local}</p>}
                {enderecoCompleto && <p>{enderecoCompleto}</p>}
              </section>
            )}

            <section className="evento-organizador">
              <label>Organizador</label>
              <p>{evento.organizador?.nome || "Organizador não informado"}</p>
            </section>

            {evento.artistas && evento.artistas.length > 0 && (
              <section className="evento-artista">
                <label>Artistas confirmados</label>
                {evento.artistas.map((a, i) => (
                  <p key={i}>{a.nome_artistico || a.nome}</p>
                ))}
              </section>
            )}

            {isArtista && (
              <button onClick={() => navigate(`/candidatar/${id}`)}>
                Inscreva-se
              </button>
            )}
          </div>
        </div>
      </main>

      <FooterSonara />
    </div>
  );
}
