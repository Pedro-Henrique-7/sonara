import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./meus-eventos-casaShow.css";
import fotoPerfil from "../img/fotoPerfil.jpg";

// Mock — substitua por chamada à API
const eventosMock = [
  {
    id: 1,
    nome: "Noite da Loucura",
    data: "22/09/2026",
    hora: "23:00",
    descricao: "Noite para curtir de montão e dançar muito",
    imagem: null,
  },
  {
    id: 2,
    nome: "Noite da Loucura",
    data: "22/09/2026",
    hora: "23:00",
    descricao: "Noite de Evento de JAZZ com instrumentos clássicos do genero",
    imagem: null,
  },
  {
    id: 3,
    nome: "Noite da Loucura",
    data: "22/09/2026",
    hora: "23:00",
    descricao: "Noite para curtir com a familia",
    imagem: null,
  },
  {
    id: 4,
    nome: "Noite da Loucura",
    data: "22/09/2026",
    hora: "23:00",
    descricao: "Noite para se endoidar e curtir de montão e dançar muito",
    imagem: null,
  },
];

const usuario = sessionStorage.getItem("usuario");
const usuarioObj = usuario ? JSON.parse(usuario) : null;

export default function ListaMeusEventos() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [eventos] = useState(eventosMock);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="meus-eventos-casa-show">
      <main
        className={`meus-eventos-casa-show__main ${
          visible ? "meus-eventos-casa-show__main--visible" : ""
        }`}
      >
        <h2 className="meus-eventos-casa-show__titulo">Meus Eventos</h2>

        <div className="meus-eventos-casa-show__grid">
          {eventos.map((evento, index) => (
            <div
              key={evento.id}
              className="meus-eventos-casa-show__card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="meus-eventos-casa-show__img-wrapper">
                {evento.imagem ? (
                  <img
                    src={evento.imagem}
                    alt={evento.nome}
                    className="meus-eventos-casa-show__img"
                  />
                ) : (
                  <div className="meus-eventos-casa-show__img-placeholder" />
                )}
              </div>

              <div className="meus-eventos-casa-show__info">
                <span className="meus-eventos-casa-show__nome">
                  {evento.nome}
                </span>

                <span className="meus-eventos-casa-show__datetime">
                  {evento.data}&nbsp;&nbsp;{evento.hora}
                </span>

                <p className="meus-eventos-casa-show__descricao">
                  {evento.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
