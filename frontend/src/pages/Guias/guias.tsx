import "./Guias.css";
import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

function Guias() {
  const guias = [
    {
      nome: "João Silva",
      especialidade: "História e Cultura",
      regiao: "Centro Histórico",
      nota: "4,9",
      avaliacoes: "124 avaliações",
      verificado: true,
      imagem:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80",
    },
    {
      nome: "Maria Oliveira",
      especialidade: "Natureza e Aventura",
      regiao: "Zona Norte",
      nota: "4,8",
      avaliacoes: "98 avaliações",
      verificado: true,
      imagem:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
    },
    {
      nome: "Carlos Mendes",
      especialidade: "Gastronomia",
      regiao: "Zona Sul",
      nota: "4,7",
      avaliacoes: "76 avaliações",
      verificado: true,
      imagem:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
    },
    {
      nome: "Ana Costa",
      especialidade: "Arte e Cultura",
      regiao: "Zona Leste",
      nota: "4,9",
      avaliacoes: "110 avaliações",
      verificado: true,
      imagem:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <div className="guias-page">
      <Navbar />

      <main className="guias-container">
        <section className="guias-hero">
          <div>
            <h1>Guias de Turismo</h1>
            <p>
              Encontre guias locais qualificados para tornar sua experiência na
              cidade ainda mais especial.
            </p>
          </div>

          <div className="guias-decoration">
            <span>📍</span>
            <div className="guias-line"></div>
            <span>🧳</span>
            <div className="guia-icon">🗺️</div>
          </div>
        </section>

        <section className="guias-search-card">
          <div className="guia-search-input">
            <span>🔍</span>
            <input type="text" placeholder="Buscar por nome do guia..." />
          </div>

          <div className="guia-filter-box">
            <label>Especialidade</label>
            <select>
              <option>Todas</option>
              <option>História e Cultura</option>
              <option>Natureza e Aventura</option>
              <option>Gastronomia</option>
              <option>Arte e Cultura</option>
            </select>
          </div>

          <div className="guia-filter-box">
            <label>Idiomas</label>
            <select>
              <option>Todos</option>
              <option>Português</option>
              <option>Inglês</option>
              <option>Espanhol</option>
            </select>
          </div>

          <div className="guia-filter-box">
            <label>Região</label>
            <select>
              <option>Todas</option>
              <option>Centro Histórico</option>
              <option>Zona Norte</option>
              <option>Zona Sul</option>
              <option>Zona Leste</option>
            </select>
          </div>

          <button className="guia-search-button">🔍 Buscar</button>
        </section>

        <section className="guias-grid">
          {guias.map((guia) => (
            <article className="guia-card" key={guia.nome}>
              <div className="guia-image">
                <img src={guia.imagem} alt={guia.nome} />
                <button className="guia-favorite">♡</button>
              </div>

              <div className="guia-content">
                <h2>
                  {guia.nome}
                  {guia.verificado && <span>✓</span>}
                </h2>

                <strong>{guia.especialidade}</strong>

                <p>📍 {guia.regiao}</p>

                <div className="guia-rating">
                  <span>⭐ {guia.nota}</span>
                  <small>({guia.avaliacoes})</small>
                </div>

                <button className="guia-card-button">Ver perfil</button>
              </div>
            </article>
          ))}
        </section>

        <div className="ver-mais-area">
          <button>Ver mais guias</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Guias;