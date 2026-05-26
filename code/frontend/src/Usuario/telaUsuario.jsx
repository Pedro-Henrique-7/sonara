import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./telaUsuario.css";
import { Search, MapPin, Clock, Calendar } from "lucide-react";
// import FooterSonara from "../footer";
import Header from "./headerUsuario";

import { buscarEventos } from "../services/eventoService";

const PLACEHOLDER_IMG =
  "https://placehold.co/600x300/1a1a2e/ffffff?text=Sem+Foto";

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
  if (!hora) return "";
  return hora.slice(0, 5);
}

function obterImagem(fotos) {
  if (fotos && fotos.length > 0 && fotos[0].caminho) {
    return fotos[0].caminho;
  }
  return PLACEHOLDER_IMG;
}

export default function TelaUsuario() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    buscarEventos()
      .then((json) => {
        const lista = json?.response?.eventos ?? [];
        setEventos(lista);
      })
      .catch((err) => {
        console.error(err);
        setErro("Não foi possível carregar os eventos.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (eventos.length === 0) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % Math.min(eventos.length, 5));
    }, 3500);
    return () => clearInterval(interval);
  }, [eventos]);

  const eventosFiltrados = eventos.filter((ev) => {
    const termo = busca.toLowerCase();
    return (
      ev.evento_nome?.toLowerCase().includes(termo) ||
      ev.cidade?.toLowerCase().includes(termo) ||
      ev.local?.toLowerCase().includes(termo)
    );
  });

  const sliderEventos = eventos.slice(0, 5);

  return (
    <div className="main-wrapper">
      <Header />

      <div className="container">
        {/* Barra de busca */}
        <div className="search-wrapper">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar por evento, local ou cidade..."
              className="search-input"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Search size={18} color="#fff" className="search-icon" />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <p>Carregando eventos...</p>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="error-state">
            <p>{erro}</p>
          </div>
        )}

        {/* Slider — só aparece quando não há busca ativa */}
        {!loading && !erro && busca === "" && sliderEventos.length > 0 && (
          <>
            <h3 className="titulo">Eventos Próximos</h3>
            <div className="slider">
              <div
                className="slider-track"
                style={{ transform: `translateX(-${sliderIndex * 100}%)` }}
              >
                {sliderEventos.map((ev, i) => (
                  <div className="slide" key={ev.id_evento ?? i}>
                    <img
                      src={obterImagem(ev.fotos)}
                      alt={ev.evento_nome}
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMG;
                      }}
                    />
                    <div className="slide-info">
                      <h4>{ev.evento_nome}</h4>
                      <span>
                        <Calendar size={13} /> {formatarData(ev.data)}
                      </span>
                    </div>
                    <div className="btn-slide">
                      <button
                        onClick={() =>
                          navigate(`/sobreEventoUsuario/${ev.id_evento}`)
                        }
                      >
                        Ver Mais
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="slider-dots">
                {sliderEventos.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === sliderIndex ? "active" : ""}`}
                    onClick={() => setSliderIndex(i)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Grid de eventos */}
        {!loading && !erro && (
          <>
            <h3 className="titulo">
              {busca ? `Resultados para "${busca}"` : "Eventos Para Você"}
            </h3>

            {eventosFiltrados.length === 0 ? (
              <p className="sem-resultados">Nenhum evento encontrado.</p>
            ) : (
              <div className="grid">
                {eventosFiltrados.map((ev, i) => (
                  <div className="card" key={ev.id_evento ?? i}>
                    <img
                      src={obterImagem(ev.fotos)}
                      alt={ev.evento_nome}
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMG;
                      }}
                    />
                    <div className="card-body">
                      <h4 className="card-titulo">{ev.evento_nome}</h4>

                      {ev.cidade && (
                        <p className="card-detalhe">
                          <MapPin size={13} />
                          {ev.cidade}
                          {ev.estado ? `, ${ev.estado}` : ""}
                        </p>
                      )}

                      {ev.data && (
                        <p className="card-detalhe">
                          <Calendar size={13} />
                          {formatarData(ev.data)}
                        </p>
                      )}

                      {ev.hora_inicio && (
                        <p className="card-detalhe">
                          <Clock size={13} />
                          {formatarHora(ev.hora_inicio)}
                          {ev.hora_fim ? ` – ${formatarHora(ev.hora_fim)}` : ""}
                        </p>
                      )}
                    </div>

                    <button
                      className="card-btn"
                      onClick={() =>
                        navigate(`/sobreEventoUsuario/${ev.id_evento}`)
                      }
                    >
                      Ver Mais
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
