import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCasaShow from "./headerCasaShow.jsx";
import "./meus-eventos-casaShow.css";
import FooterSonara from "../Artista/footer.jsx";

const PLACEHOLDER_IMG =
  "https://placehold.co/600x300/1a1a2e/ffffff?text=Sem+Foto";

function formatarData(dataISO) {
  if (!dataISO) return "Data não informada";
  return new Date(dataISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ListaMeusEventos() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
      navigate("/login");
      return;
    }

    const u = JSON.parse(usuario);
    const organizador_id = u.id_usuario;

    fetch(`${import.meta.env.VITE_API_URL}/eventosDoOrganizador/${organizador_id}`)
      .then((r) => r.json())
      .then((json) => {
        const dados = json?.response?.Organizador;
        if (!dados) {
          setEventos([]);
          return;
        }
        setEventos(Array.isArray(dados) ? dados : [dados]);
      })
      .catch(() => setErro("Não foi possível carregar seus eventos."))
      .finally(() => setLoading(false));
  }, [navigate]);

  function obterImagem(ev) {
    if (ev.fotos?.length > 0 && ev.fotos[0].caminho) return ev.fotos[0].caminho;
    if (ev.url_foto) return ev.url_foto;
    return PLACEHOLDER_IMG;
  }

  return (
    <div className="meus-eventos-casa-show">
      <HeaderCasaShow />
      <main
        className={`meus-eventos-casa-show__main ${
          visible ? "meus-eventos-casa-show__main--visible" : ""
        }`}
      >
        <h2 className="meus-eventos-casa-show__titulo">Meus Eventos</h2>

        {loading && (
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Carregando eventos...</p>
        )}

        {erro && (
          <p style={{ color: "#ffb3a7", marginBottom: "1rem" }}>{erro}</p>
        )}

        {!loading && !erro && eventos.length === 0 && (
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              paddingTop: "4rem",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Você ainda não criou nenhum evento.
            </p>
            <button
              onClick={() => navigate("/marcarEvento")}
              style={{
                background: "linear-gradient(135deg,#f4511e,#ff7a1a)",
                border: "none",
                borderRadius: "999px",
                color: "#fff",
                padding: "0.8rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                width: "auto",
              }}
            >
              Criar meu primeiro evento
            </button>
          </div>
        )}

        {!loading && eventos.length > 0 && (
          <div className="meus-eventos-casa-show__grid">
            {eventos.map((evento, index) => (
              <div
                key={evento.id_evento ?? index}
                className="meus-eventos-casa-show__card"
                style={{ animationDelay: `${index * 0.1}s`, cursor: "pointer" }}
                onClick={() => navigate(`/editarEvento/${evento.id_evento}`)}
              >
                <div className="meus-eventos-casa-show__img-wrapper">
                  <img
                    src={obterImagem(evento)}
                    alt={evento.nome ?? evento.evento_nome ?? "Evento"}
                    className="meus-eventos-casa-show__img"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                  />
                </div>

                <div className="meus-eventos-casa-show__info">
                <span className="meus-eventos-casa-show__nome">
                {evento.evento_nome ?? "Sem título"}
                </span>

                  {evento.local && (
                    <p
                      className="meus-eventos-casa-show__descricao"
                      style={{ fontSize: "0.78rem", opacity: 0.8 }}
                    >
                      📍 {evento.local}
                      {evento.cidade ? `, ${evento.cidade}` : ""}
                    </p>
                  )}

                  {evento.descricao && (
                    <p className="meus-eventos-casa-show__descricao">
                      {evento.descricao.length > 100
                        ? evento.descricao.slice(0, 100) + "…"
                        : evento.descricao}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editarEvento/${evento.id_evento}`);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "0.4rem 0.9rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        width: "auto",
                        height: "auto",
                      }}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/sobreEventoCasaShow`);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        color: "rgba(255,255,255,0.8)",
                        padding: "0.4rem 0.9rem",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        width: "auto",
                        height: "auto",
                      }}
                    >
                      Ver detalhes
                    </button>
                  </div>
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