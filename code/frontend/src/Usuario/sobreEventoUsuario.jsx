import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./sobreEventoUsuario.css";

import fotoShow from "../img/fotoShow.png";

import Header from "./headerUsuario";

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

// AGORA ACEITA URL OU CAMINHO
function obterImagens(fotos) {
  if (Array.isArray(fotos) && fotos.length > 0) {
    return fotos;
  }

  return [{ url: PLACEHOLDER_IMG }];
}

export default function SobreEventoUsuario() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [evento, setEvento] = useState(null);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState(null);

  // IMAGENS
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  useEffect(() => {
    async function carregarEvento() {
      try {
        if (!id) {
          throw new Error("ID do evento não informado.");
        }

        const json = await buscarEventosPorId(id);

        const ev =
          json?.response?.evento ||
          json?.response?.Evento ||
          json?.evento ||
          json?.Evento ||
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

  // LOADING
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

  // ERRO
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

  // IMAGENS
  const imagens = obterImagens(evento.fotos);

  // ENDEREÇO
  const end = evento.endereco || {};

  const enderecoCompleto = end.logradouro
    ? `${end.logradouro}, ${end.numero || "S/N"}${
        end.complemento ? ` - ${end.complemento}` : ""
      }, ${end.bairro || ""} - ${end.cidade || ""}/${end.estado || ""}`
    : null;

  return (
    <div className="main-wrapper">
      <Header />

      <main className="container-principal">
        {/* ESQUERDA */}
        <div className="left">
          {/* IMAGEM PRINCIPAL */}
          <img
            src={
              imagens[imagemSelecionada]?.url ||
              imagens[imagemSelecionada]?.caminho ||
              PLACEHOLDER_IMG
            }
            alt={evento.nome || "Evento"}
            className="main-img"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMG;
            }}
          />

          {/* MINI IMAGENS */}
          <div className="thumbs">
            {imagens.map((foto, i) => (
              <img
                key={i}
                src={foto.url || foto.caminho || PLACEHOLDER_IMG}
                alt={`Thumb ${i + 1}`}
                className={imagemSelecionada === i ? "thumb active" : "thumb"}
                onClick={() => setImagemSelecionada(i)}
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
            {/* NOME */}
            <section className="evento-nome">
              <label>Nome do evento</label>

              <p>{evento.nome || "Nome não informado"}</p>
            </section>

            {/* DESCRIÇÃO */}
            <section className="evento-descricao">
              <label>Descrição</label>

              <p>{evento.descricao || "Sem descrição disponível."}</p>
            </section>

            {/* DATA E HORA */}
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

            {/* LOCAL */}
            {(evento.local || enderecoCompleto) && (
              <section className="evento-local">
                <label>Local</label>

                {evento.local && <p>{evento.local}</p>}

                {enderecoCompleto && <p>{enderecoCompleto}</p>}
              </section>
            )}

            {/* ORGANIZADOR */}
            <section className="evento-organizador">
              <label>Organizador</label>

              <p>{evento.organizador?.nome || "Organizador não informado"}</p>
            </section>

            {/* ARTISTAS */}
            {evento.artistas && evento.artistas.length > 0 && (
              <section className="evento-artista">
                <label>Artistas confirmados</label>

                {evento.artistas.map((a, i) => (
                  <p key={i}>{a.nome_artistico || a.nome}</p>
                ))}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
