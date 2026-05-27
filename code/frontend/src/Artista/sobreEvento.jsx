import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./sobreEvento.css";
import fotoShow from "../img/fotoShow.png";
import Header from "./header";
import FooterSonara from "./footer";

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
  if (fotos && fotos.length > 0 ) {
    return fotos;
  }
  return PLACEHOLDER_IMG;
}

export default function SobreEvento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!id) {
      setErro("ID do evento não informado.");
      setLoading(false);
      return;
    }

    buscarEventosPorId(id)
      .then((json) => {
        const ev = json?.response?.evento ?? null;
        if (!ev) throw new Error("Evento não encontrado.");
        setEvento(ev);
      })
      .catch((err) => {
        console.error(err);
        setErro("Não foi possível carregar o evento.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="main-wrapper">
        <Header />
        <div className="loading-state">Carregando evento...</div>
        <FooterSonara />
      </div>
    );
  }

  if (erro || !evento) {
    return (
      <div className="main-wrapper">
        <Header />
        <div className="error-state">
          <p>{erro ?? "Evento não encontrado."}</p>
          <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
        <FooterSonara />
      </div>
    );
  }

  const imagens = obterImagem(evento.fotos);
  console.log(imagens)

  const enderecoCompleto = evento.logradouro
    ? `${evento.logradouro}, ${evento.numero}${evento.complemento ? ` – ${evento.complemento}` : ""}, ${evento.bairro} – ${evento.cidade}/${evento.estado}`
    : null;

    console.log(imagens[0].url)
  return (
    <div className="main-wrapper">
      <Header />
      <main className="container-principal">

        {/* ESQUERDA */}
        <div className="left">
          <img
            src={imagens[0].url}
            alt={evento.nome}
            className="main-img"
            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          />

          <div className="stars">★★★★★</div>

          <div className="thumbs">
            {imagens.map((foto, i) => (
              <img
                key={i}
                src={foto.url}
                alt=""
                onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
              />
            ))}
          </div>
        </div>

        {/* DIREITA */}
        <div className="right">
          <div className="form-box">

            <section className="evento-nome">
              <label>Nome do evento</label>
              <p>{evento.nome}</p>
            </section>

            <section className="evento-descricao">
              <label>Descrição:</label>
              <p>{evento.descricao ?? "Sem descrição disponível."}</p>
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
                  {evento.hora_fim ? ` – ${formatarHora(evento.hora_fim)}` : ""}
                </p>
              </section>
            </div>

            {(evento.local || enderecoCompleto) && (
              <section className="evento-local">
                <label>Local</label>
                <p>{evento.local}</p>
                {enderecoCompleto && (
                  <p>{enderecoCompleto}</p>
                )}
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

            <button onClick={() => navigate("/eventoInscricao")}>
              Inscreva-se
            </button>

          </div>
        </div>
      </main>
      <FooterSonara />
    </div>
  );
}
