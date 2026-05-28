import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./meusEventosLista.css";
import Header from "./header";
import FooterSonara from "./footer";
import { buscarUsuarioPorId } from "../services/usuarioService";

const PLACEHOLDER_IMG =
  "https://placehold.co/600x300/1a1a2e/ffffff?text=Sem+Foto";

export default function ListaEventos() {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function carregarEventos() {
      try {
        setLoading(true);
        setErro("");

        const usuarioSalvo = sessionStorage.getItem("usuario");

        if (!usuarioSalvo) {
          navigate("/login");
          return;
        }

        const usuarioSession = JSON.parse(usuarioSalvo);

        const response = await buscarUsuarioPorId(usuarioSession.id_usuario);

        const usuarioAtualizado = response.response.usuario;

        sessionStorage.setItem(
          "usuario",
          JSON.stringify(usuarioAtualizado)
        );

        setEventos(usuarioAtualizado.artista?.eventos || []);
      } catch (error) {
        console.log(error);
        setErro("Erro ao carregar seus eventos.");
      } finally {
        setLoading(false);
      }
    }

    carregarEventos();
  }, [navigate]);

  return (
    <div className="lista-eventos-page">
      <Header />

      <h2 className="lista-eventos-titulo">Meus Eventos</h2>

      <main
        className={`lista-eventos-main ${
          visible ? "lista-eventos-main--visible" : ""
        }`}
      >
        {loading && <p style={{ color: "#fff" }}>Carregando eventos...</p>}

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        {!loading && !erro && eventos.length === 0 && (
          <p style={{ color: "#fff" }}>Nenhum evento encontrado.</p>
        )}

        {!loading && !erro && eventos.length > 0 && (
          <div className="lista-eventos-grid">
            {eventos.map((evento, index) => (
              <div
                key={evento.id_evento}
                className="evento-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/sobreEvento/${evento.id_evento}`)}
              >
                <div className="evento-card__img-wrapper">
                  <img
                    src={
                      evento.fotos?.[0]?.url ||
                      evento.fotos?.[0]?.caminho ||
                      evento.imagem ||
                      evento.foto ||
                      PLACEHOLDER_IMG
                    }
                    alt={evento.nome || evento.evento_nome || "Evento"}
                    className="evento-card__img"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMG;
                    }}
                  />
                </div>

                <div className="evento-card__info">
                  <span className="evento-card__nome">
                    {evento.nome || evento.evento_nome}
                  </span>

                  <span className="evento-card__datetime">
                    {evento.data || evento.data_evento || "Data não informada"}
                    &nbsp;&nbsp;
                    {evento.hora || evento.horario || ""}
                  </span>

                  <p className="evento-card__descricao">
                    {evento.descricao || "Sem descrição."}
                  </p>
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