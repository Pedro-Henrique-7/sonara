import "./telaInicial.css";

export default function telaInicial() {
  return (
    <div className="home-container">
      <header className="header">
        <nav className="nav">
          <button className="nav-btn active">Home</button>
          <button className="nav-btn">Buscar</button>
          <button className="nav-btn">Meus Eventos</button>
          <button className="nav-btn">Plano</button>
        </nav>

        <div className="perfil-area">
          <div className="perfil-info">
            <h2>Gabriel</h2>
            <span>Organizador de Eventos</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="painel">
          <div className="painel-titulo">
            <h1>Olá Usuario</h1>
            <h2>O que vamos fazer hoje?</h2>
          </div>

          <div className="cards-grid">
            <div className="card">Criar Eventos</div>

            <div className="card">Contratar Artistas</div>

            <div className="card">Meus Eventos</div>

            <div className="card">Suporte</div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-box">
          <h3>NOSSO ENDEREÇO:</h3>
          <p>JandiraCity, 123–São Paulo-SP</p>
        </div>

        <div className="footer-box">
          <h3>SOBRE NÓS:</h3>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>

        <div className="footer-box">
          <h3>CONTATO:</h3>
          <p>Email: sonara@gmail.com.br</p>
          <p>Telefone: (11) 99999-9999</p>
        </div>
      </footer>
    </div>
  );
}
