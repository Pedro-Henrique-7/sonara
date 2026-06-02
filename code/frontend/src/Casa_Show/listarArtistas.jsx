// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import HeaderCasaShow from "./headerCasaShow.jsx";
// import FooterSonara from "../Artista/footer.jsx";
// import ModalProposta from "./modalProposta.jsx";
// import { listarArtistas } from "../services/artista.service";
// import "./listaArtistas.css";

// export default function ListaArtistas() {
//   const navigate = useNavigate();

//   const [artistas, setArtistas] = useState([]);
//   const [carregando, setCarregando] = useState(true);
//   const [erro, setErro] = useState("");
//   const [busca, setBusca] = useState("");
//   const [artistaSelecionado, setArtistaSelecionado] = useState(null);
//   const [sucesso, setSucesso] = useState(false);

//   useEffect(() => {
//     async function carregar() {
//       try {
//         const dados = await listarArtistas();
//         setArtistas(dados);
//       } catch (err) {
//         setErro(err.message);
//       } finally {
//         setCarregando(false);
//       }
//     }
//     carregar();
//   }, []);

//   const artistasFiltrados = artistas.filter((a) =>
//     a.nome_artistico?.toLowerCase().includes(busca.toLowerCase()) ||
//     a.generos_musicais?.some((g) =>
//       g.nome?.toLowerCase().includes(busca.toLowerCase())
//     )
//   );

//   function handleSucesso() {
//     setSucesso(true);
//     setTimeout(() => setSucesso(false), 3500);
//   }

//   return (
//     <div className="home-container">
//       <HeaderCasaShow />

//       <main className="main">
//         <section className="painel">
//           <div className="painel-titulo">
//             <h1>Contratar Artistas</h1>
//             <h2>Encontre o artista ideal para o seu evento</h2>
//           </div>

//           {/* Barra de busca */}
//           <div className="artistas-busca-wrapper">
//             <input
//               className="artistas-busca"
//               type="text"
//               placeholder="Buscar por nome ou gênero musical..."
//               value={busca}
//               onChange={(e) => setBusca(e.target.value)}
//             />
//           </div>

//           {/* Feedback de sucesso */}
//           {sucesso && (
//             <div className="artistas-sucesso">
//               ✓ Proposta enviada com sucesso! O artista receberá a solicitação.
//             </div>
//           )}

//           {/* Estados de carregamento / erro */}
//           {carregando && (
//             <p className="artistas-info">Carregando artistas...</p>
//           )}
//           {erro && <p className="artistas-info artistas-erro">{erro}</p>}
//           {!carregando && !erro && artistasFiltrados.length === 0 && (
//             <p className="artistas-info">Nenhum artista encontrado.</p>
//           )}

//           {/* Grid de artistas */}
//           {!carregando && !erro && (
//             <div className="artistas-grid">
//               {artistasFiltrados.map((artista) => (
//                 <div key={artista.id_artista} className="artista-card">
//                   <div className="artista-card-avatar">
//                     {artista.foto ? (
//                       <img src={artista.foto} alt={artista.nome_artistico} />
//                     ) : (
//                       <span>
//                         {artista.nome_artistico?.[0]?.toUpperCase()}
//                       </span>
//                     )}
//                   </div>

//                   <div className="artista-card-info">
//                     <h3 className="artista-card-nome">
//                       {artista.nome_artistico}
//                     </h3>

//                     {artista.generos_musicais?.length > 0 && (
//                       <div className="artista-card-generos">
//                         {artista.generos_musicais.slice(0, 3).map((g) => (
//                           <span key={g.id} className="artista-card-tag">
//                             {g.nome}
//                           </span>
//                         ))}
//                       </div>
//                     )}

//                     {artista.descricao_artista && (
//                       <p className="artista-card-desc">
//                         {artista.descricao_artista}
//                       </p>
//                     )}

//                     {artista.media_avaliacao_artista > 0 && (
//                       <div className="artista-card-avaliacao">
//                         <span className="estrela">★</span>
//                         <span>
//                           {artista.media_avaliacao_artista} (
//                           {artista.total_avaliacoes_artista}{" "}
//                           {artista.total_avaliacoes_artista === 1
//                             ? "avaliação"
//                             : "avaliações"}
//                           )
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     className="artista-card-btn"
//                     onClick={() => setArtistaSelecionado(artista)}
//                   >
//                     Fazer Proposta
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>

//       <FooterSonara />

//       {/* Modal de proposta */}
//       {artistaSelecionado && (
//         <ModalProposta
//           artista={artistaSelecionado}
//           onFechar={() => setArtistaSelecionado(null)}
//           onSucesso={handleSucesso}
//         />
//       )}
//     </div>
//   );
// }