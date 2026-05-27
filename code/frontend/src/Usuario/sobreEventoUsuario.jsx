import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import "./sobreEventoUsuario.css";

import fotoShow from "../img/fotoShow.png";

import Header from "./headerUsuario";

// import FooterSonara from "./footer";

import { buscarEventosPorId } from "../services/eventoService";

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

function obterImagem(fotos) {
  if (fotos && Array.isArray(fotos) && fotos.length > 0 && fotos[0].caminho) {
    return fotos[0].caminho;
  }

  return PLACEHOLDER_IMG;
}

export default function SobreEventoUsuario() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [evento, setEvento] = useState(null);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState(null);

  // AVALIAÇÃO
  const totalEstrelas = 5;

  const [nota, setNota] = useState(0);

  const [hoverNota, setHoverNota] = useState(0);

  useEffect(() => {
    async function carregarEvento() {
      try {
        if (!id) {
          throw new Error("ID do evento não informado.");
        }

        console.log("ID RECEBIDO:", id);

        const json = await buscarEventosPorId(id);

        console.log("RESPOSTA API:", json);

        // TENTA PEGAR O EVENTO EM DIFERENTES FORMATOS
        const ev =
          json?.response?.Evento ||
          json?.response?.evento ||
          json?.Evento ||
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
      </div>
    );
  }

  const imagemPrincipal = obterImagem(evento.fotos);

  const enderecoCompleto = evento.logradouro
    ? `${evento.logradouro}, ${evento.numero || "S/N"}${
        evento.complemento ? ` - ${evento.complemento}` : ""
      }, ${evento.bairro || ""} - ${evento.cidade || ""}/${evento.estado || ""}`
    : null;

  return (
    <div className="main-wrapper">
      <Header />

      <main className="container-principal">
        {/* ESQUERDA */}
        <div className="left">
          <img
            src={imagemPrincipal}
            alt={evento.evento_nome || "Evento"}
            className="main-img"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMG;
            }}
          />

          {/* ESTRELAS */}
          <div className="sonaraSobreArtistaAvaliacao">
            {[...Array(totalEstrelas)].map((_, index) => {
              const valorAtual = index + 1;

              return (
                <FaStar
                  key={valorAtual}
                  className={
                    valorAtual <= (hoverNota || nota)
                      ? "sonaraSobreArtistaStarOn"
                      : "sonaraSobreArtistaStarOff"
                  }
                  onMouseEnter={() => setHoverNota(valorAtual)}
                  onMouseLeave={() => setHoverNota(0)}
                  onClick={() => setNota(valorAtual)}
                />
              );
            })}

            <span className="sonaraSobreArtistaNotaTexto">{nota}.0</span>
          </div>

          {/* MINIATURAS */}
          <div className="thumbs">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={imagemPrincipal}
                alt={`Thumb ${i}`}
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMG;
                }}
              />
            ))}
          </div>
        </div>

        {/* DIREITA */}
        <div className="right">
          <div className="form-box">
            <section className="evento-nome">
              <label>Nome do evento</label>

              <p>{evento.evento_nome || evento.nome || "Nome não informado"}</p>
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

            {evento.organizador_nome && (
              <section className="evento-organizador">
                <label>Organizador</label>

                <p>{evento.organizador_nome}</p>
              </section>
            )}

            {evento.artista && (
              <section className="evento-artista">
                <label>Artista</label>

                <p>{evento.artista}</p>

                {evento.sobre_artista && <p>{evento.sobre_artista}</p>}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
