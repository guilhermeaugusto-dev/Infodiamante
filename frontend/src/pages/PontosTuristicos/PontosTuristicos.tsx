import "./PontosTuristicos.css";
import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";
import imagemIgreja from "../../templates/igreja-turismo.png";

function PontosTuristicos() {
  const pontos = [
    {
      nome: "Igreja de São Francisco",
      categoria: "Histórico",
      regiao: "Centro Histórico",
      nota: "4,9",
      avaliacoes: "1.240 avaliações",
      destaque: "Mais visitado",
      imagem:
        "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=900&q=80",
    },
    {
      nome: "Mirante do Morro Redondo",
      categoria: "Natureza",
      regiao: "Zona Sul",
      nota: "4,8",
      avaliacoes: "980 avaliações",
      imagem:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    },
    {
      nome: "Parque das Acácias",
      categoria: "Lazer",
      regiao: "Zona Leste",
      nota: "4,7",
      avaliacoes: "756 avaliações",
      imagem:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    },
    {
      nome: "Theatro Municipal",
      categoria: "Cultura",
      regiao: "Centro",
      nota: "4,9",
      avaliacoes: "1.102 avaliações",
      imagem:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
    },
    {
      nome: "Museu de Arte Moderna",
      categoria: "Cultura",
      regiao: "Zona Sul",
      nota: "4,6",
      avaliacoes: "642 avaliações",
      imagem:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    },
    {
      nome: "Cachoeira do Encanto",
      categoria: "Natureza",
      regiao: "Zona Norte",
      nota: "4,8",
      avaliacoes: "834 avaliações",
      imagem:
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80",
    },
    {
      nome: "Mercado Central",
      categoria: "Gastronomia",
      regiao: "Centro",
      nota: "4,7",
      avaliacoes: "1.536 avaliações",
      imagem:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    },
    {
      nome: "Lagoa do Sol",
      categoria: "Lazer",
      regiao: "Zona Oeste",
      nota: "4,6",
      avaliacoes: "712 avaliações",
      imagem:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <div className="pontos-page">
      <Navbar />

      <main className="pontos-container">
        <section className="pontos-hero">
          <div>
            <h1>Pontos Turísticos</h1>
            <p>
              Descubra os lugares mais incríveis da cidade e viva experiências
              inesquecíveis.
            </p>
          </div>

       <div className="hero-decoration">
  <img
    src={imagemIgreja}
    alt="Ilustração de igreja"
    className="church-hero-image"
  />
</div>
        </section>

        <section className="search-card">
          <div className="search-input">
            <span>🔍</span>
            <input type="text" placeholder="Buscar por nome do lugar..." />
          </div>

          <div className="filter-box">
            <label>Categoria</label>
            <select>
              <option>Todas as categorias</option>
              <option>Histórico</option>
              <option>Natureza</option>
              <option>Cultura</option>
              <option>Gastronomia</option>
              <option>Lazer</option>
            </select>
          </div>

          <div className="filter-box">
            <label>Região</label>
            <select>
              <option>Todas as regiões</option>
              <option>Centro</option>
              <option>Zona Norte</option>
              <option>Zona Sul</option>
              <option>Zona Leste</option>
              <option>Zona Oeste</option>
            </select>
          </div>

          <div className="filter-box">
            <label>Ordenar por</label>
            <select>
              <option>Mais populares</option>
              <option>Melhor avaliados</option>
              <option>Mais próximos</option>
            </select>
          </div>

          <button className="search-button">🔍 Buscar</button>
        </section>

        <section className="cards-grid">
          {pontos.map((ponto) => (
            <article className="ponto-card" key={ponto.nome}>
              <div className="card-image">
                <img src={ponto.imagem} alt={ponto.nome} />

                {ponto.destaque && (
                  <span className="featured-badge">{ponto.destaque}</span>
                )}

                <button className="favorite-button">♡</button>
              </div>

              <div className="card-content">
                <h2>{ponto.nome}</h2>

                <span
                  className={`category-tag ${ponto.categoria
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}`}
                >
                  {ponto.categoria}
                </span>

                <div className="card-footer">
                  <span>📍 {ponto.regiao}</span>
                  <strong>⭐ {ponto.nota}</strong>
                  <small>({ponto.avaliacoes})</small>
                </div>
              </div>
            </article>
          ))}
        </section>

        <div className="pagination">
          <button>«</button>
          <button className="active-page">1</button>
          <button>2</button>
          <button>3</button>
          <span>...</span>
          <button>8</button>
          <button>»</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PontosTuristicos;