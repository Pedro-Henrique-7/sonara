import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react"; // <-- importa hooks
import "./telaperfilArtista.css";
// import fotoShow from "./img/fotoShow.png";
import fotoPerfil from "./img/fotoPerfil.jpg";
// import artistaImg from "./img/artista.jpg";

export default function PerfilArtista() {
  const navigate = useNavigate();

  // Estado para armazenar a URL da foto de perfil (inicia com a imagem padrão)
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(fotoPerfil);

  // Referência para o input de arquivo oculto
  const inputFileRef = useRef(null);

  // Abrir seletor de arquivos ao clicar no lápis
  const handleFotoClick = () => {
    inputFileRef.current?.click();
  };

  // Processar o arquivo selecionado
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação opcional: aceitar apenas imagens
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    // Criar URL local para preview
    const imageUrl = URL.createObjectURL(file);
    setFotoPerfilUrl(imageUrl);
  };

  return (
    <div className="pa-wrapper">
      {/* HEADER - igual ao seu código */}
      <header>
        <div className="content-limit">
          <div className="header-top">
            <nav className="nav">
              <span className="nav-item" onClick={() => navigate("/shows")}>
                Home
              </span>
              <span className="nav-item">Buscar</span>
              <span
                className="nav-item"
                onClick={() => navigate("/listaEventos")}
              >
                Meus Eventos
              </span>
              <span
                className="nav-item"
                onClick={() => navigate("/planosArtista")}
              >
                Plano
              </span>
            </nav>

            <div className="user">
              <div className="user-info">
                <span
                  className="user-name"
                  onClick={() => navigate("/perfil-artista")}
                >
                  Yuri Silva
                </span>
                <span className="user-role">Artista</span>
              </div>
              <div className="avatar">
                <img src={fotoPerfil} alt="Perfil" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CENTRAL CONTAINER */}
      <div className="pa-central">
        {/* LEFT COLUMN */}
        <div className="pa-col-left">
          {/* Artist Photo */}
          <div className="pa-foto-wrapper">
            <div className="pa-foto-circle">
              {/* Substitui placeholder pela imagem real ou preview */}
              {fotoPerfilUrl ? (
                <img src={fotoPerfilUrl} alt="Artista" />
              ) : (
                <div className="pa-foto-placeholder" />
              )}
            </div>
            <button
              className="pa-edit-btn"
              title="Editar foto"
              onClick={handleFotoClick}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            {/* Input de arquivo invisível */}
            <input
              type="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Planos - mantém igual */}
          <div className="pa-plano-card">
            <div className="pa-plano-header">
              <span className="pa-plano-titulo">Plano Diamante</span>
              <svg
                className="pa-plano-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
            <p className="pa-plano-desc">
              "O plano definitivo para artistas estabelecidos. Tenha acesso
              ilimitado a todas as ferramentas da plataforma, analytics
              avançados, posicionamento premium nas buscas e suporte dedicado
              24/7. Maximize sua visibilidade e alcance novos patamares na sua
              carreira."
            </p>
          </div>

          <div className="pa-plano-card pa-plano-card--secondary">
            <div className="pa-plano-header">
              <span className="pa-plano-titulo">Plano Platina</span>
              <svg
                className="pa-plano-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
            <p className="pa-plano-desc">
              "Acesse recursos exclusivos para artistas em crescimento. Divulgue
              seus eventos para um público maior, receba suporte prioritário e
              tenha destaque nas buscas da plataforma. Ideal para quem está
              começando a construir sua presença no cenário musical."
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN - mantém igual */}
        <div className="pa-col-right">
          <div className="pa-eventos-card">
            <h3 className="pa-card-title">Meus Eventos</h3>
            <div className="pa-eventos-content">
              <div className="pa-eventos-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="pa-evento-thumb">
                    <div className="pa-thumb-placeholder" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pa-dados-card">
            <h3 className="pa-card-title">Dados de Artista</h3>
            <div className="pa-dados-grid">
              <input className="pa-input" type="text" placeholder="Nome" />
              <input
                className="pa-input"
                type="text"
                placeholder="nascimento"
              />
              <input className="pa-input" type="text" placeholder="email" />
              <input className="pa-input" type="text" placeholder="Telefone" />
              <input
                className="pa-input"
                type="text"
                placeholder="nacionalidade"
              />

              <input className="pa-input" type="text" placeholder="Genero" />
              <input className="pa-input" type="text" placeholder="Rua" />
              <input className="pa-input" type="text" placeholder="Bairro" />
              <input className="pa-input" type="text" placeholder="Cidade" />
              <input className="pa-input" type="text" placeholder="UF" />
              <input className="pa-input" type="text" placeholder="CEP" />
            </div>
            <div className="pa-dados-actions">
              <button className="pa-btn pa-btn-cancelar">Cancelar</button>
              <button className="pa-btn pa-btn-salvar">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
