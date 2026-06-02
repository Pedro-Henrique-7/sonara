import "./contratarArtista.css";
import { useEffect, useState } from "react";
import { FaEye, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HeaderCasaShow from "./headerCasaShow.jsx";
import FooterSonara from "../Artista/footer.jsx";
import { listarArtistas } from "../services/artistaService.js";

export default function TelaContratarArtistas() {
  const navigate = useNavigate();

  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarArtistas();

        // A API retorna { response: { Artista: [...] } }
        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.response?.Artista)
          ? dados.response.Artista
          : Array.isArray(dados?.response)
          ? dados.response
          : [];

        // Deduplica por artista_id e agrupa redes sociais
        const mapa = new Map();
        for (const item of lista) {
          if (!mapa.has(item.artista_id)) {
            mapa.set(item.artista_id, {
              ...item,
              redes_sociais: item.rede_social_link
                ? [{ link: item.rede_social_link, tipo: item.rede_social_tipo }]
                : [],
            });
          } else if (item.rede_social_link) {
            mapa.get(item.artista_id).redes_sociais.push({
              link: item.rede_social_link,
              tipo: item.rede_social_tipo,
            });
          }
        }

        setArtistas(Array.from(mapa.values()));
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const artistasFiltrados = artistas.filter(
    (a) =>
      a.nome_artistico?.toLowerCase().includes(busca.toLowerCase()) ||
      a.sobre_artista?.toLowerCase().includes(busca.toLowerCase()) ||
      a.cidade?.toLowerCase().includes(busca.toLowerCase())
  );

  // Renderiza estrelas com base na média (0–5)
  function renderEstrelas(media) {
    const arredondado = Math.round(media || 0);
    return [1, 2, 3, 4, 5].map((i) => (
      <FaStar
        key={i}
        className={i > arredondado ? "sonaraContratarEstrelaOff" : ""}
      />
    ));
  }

  return (
    <div className="sonaraContratarPagina">
      <HeaderCasaShow />

      <main className="sonaraContratarConteudo">
        <h1 className="sonaraContratarTitulo">Contrate um Artista</h1>

        {/* Busca */}
        <input
          className="sonaraContratarBusca"
          type="text"
          placeholder="Buscar por nome, cidade ou estilo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {/* Estados */}
        {loading && (
          <p className="sonaraContratarInfo">Carregando artistas...</p>
        )}
        {erro && (
          <p className="sonaraContratarInfo sonaraContratarErro">{erro}</p>
        )}
        {!loading && !erro && artistasFiltrados.length === 0 && (
          <p className="sonaraContratarInfo">Nenhum artista encontrado.</p>
        )}

        {/* Grid */}
        {!loading && !erro && artistasFiltrados.length > 0 && (
          <div className="sonaraContratarGrid">
            {artistasFiltrados.map((artista) => (
              <div className="sonaraContratarCard" key={artista.artista_id}>
                <div className="sonaraContratarCardTopo">
                  <div
                    className="sonaraContratarFoto"
                    style={
                      artista.foto
                        ? { backgroundImage: `url(${artista.foto})` }
                        : {}
                    }
                  />
                </div>

                <div className="sonaraContratarCardConteudo">
                  <h2>{artista.nome_artistico}</h2>

                  <span>{artista.cidade || "Artista Musical"}</span>

                  <div className="sonaraContratarEstrelas">
                    {renderEstrelas(0)}
                  </div>

                  {artista.cidade && <p>{artista.cidade}, {artista.estado}</p>}

                  <small>
                    {artista.sobre_artista
                      ? artista.sobre_artista.slice(0, 60) +
                        (artista.sobre_artista.length > 60 ? "..." : "")
                      : ""}
                  </small>

                  <button
                    className="sonaraContratarBtnVerMais"
                    onClick={() =>
                      navigate("/sobreArtista", { state: { artista } })
                    }
                  >
                    <FaEye />
                    Ver mais
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <FooterSonara />
    </div>
  );
}