import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./telaUsuario.css";
import { Search, MapPin, Clock, Calendar } from "lucide-react";
import FooterSonara from "../Artista/footer";
import Header from "./headerUsuario";
import { buscarUsuarioPorId } from "../services/usuarioService";

import { buscarEventos } from "../services/eventoService";

// Placeholder para eventos sem foto
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

// Usa o campo "caminho" que é o correto na API do usuário
function obterImagem(fotos) {
  if (fotos && fotos.length > 0 && fotos[0]?.caminho) {
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

  // Busca usuário atualizado e salva na sessionStorage
  useEffect(() => {
    const carregarUsuarioCompleto = async () => {
      try {
        const usuarioStorage = JSON.parse(sessionStorage.getItem("usuario"));

        if (!usuarioStorage?.id_usuario) return;

        const json = await buscarUsuarioPorId(usuarioStorage.id_usuario);
        const usuarioCompleto = json?.response?.usuario;

        if (usuarioCompleto) {
          sessionStorage.setItem("usuario", JSON.stringify(usuarioCompleto));
        }
      } catch (error) {
        console.error("Erro ao carregar usuário completo:", error);
      }
    };

    carregarUsuarioCompleto();
  }, []);

  // Busca os eventos da API
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

  // Reseta o índice do slider quando a lista de eventos muda
  useEffect(() => {
    setSliderIndex(0);
  }, [eventos]);

  // Avança o slider automaticamente
  useEffect(() => {
    if (eventos.length === 0) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % Math.min(eventos.length, 5));
    }, 3500);
    return () => clearInterval(interval);
  }, [eventos]);

  // Filtra pelo campo de busca (nome, cidade ou local)
  const eventosFiltrados = eventos.filter((ev) => {
    const termo = busca.toLowerCase();
    return (
      ev.evento_nome?.toLowerCase().includes(termo) ||
      ev.cidade?.toLowerCase().includes(termo) ||
      ev.local?.toLowerCase().includes(termo)
    );
  });

  // Primeiros eventos para o slider (máx 5)
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

        {/* Estado de loading */}
        {loading && (
          <div className="loading-state">
            <p>Carregando eventos...</p>
          </div>
        )}

        {/* Estado de erro */}
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
                      {/* <p> em vez de <span> para evitar bloco dentro de inline */}
                      <p className="card-detalhe">
                        <Calendar size={13} /> {formatarData(ev.data)}
                      </p>
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

              {/* Key estável usando id_evento nos dots */}
              <div className="slider-dots">
                {sliderEventos.map((ev, i) => (
                  <span
                    key={ev.id_evento ?? i}
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

      <FooterSonara />
    </div>
  );
}
