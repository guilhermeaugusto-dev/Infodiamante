import "./Avaliacoes.css";
import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

function Avaliacoes() {
  const avaliacoes = [
    {
      nome: "Mariana Souza",
      lugar: "Visitou Igreja de São Francisco",
      nota: 5,
      data: "12/05/2024",
      texto:
        "Lugar incrível! A arquitetura é deslumbrante e a história fascinante. Super recomendo a visita guiada.",
      categoria: "Histórico",
      imagem:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
    {
      nome: "Roberto Lima",
      lugar: "Visitou Mirante do Morro Redondo",
      nota: 5,
      data: "10/05/2024",
      texto:
        "A vista é espetacular. Melhor lugar para ver o pôr do sol na cidade. Voltarei com certeza.",
      categoria: "Natureza",
      imagem:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
    {
      nome: "Juliana Pereira",
      lugar: "Visitou Theatro Municipal",
      nota: 5,
      data: "08/05/2024",
      texto:
        "Experiência maravilhosa! O teatro é lindo e os eventos são de alta qualidade.",
      categoria: "Cultura",
      imagem:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="avaliacoes-page">
      <Navbar />

      <main className="avaliacoes-container">
        <section className="avaliacoes-hero">
          <div>
            <h1>Avaliações</h1>
            <p>
              Veja o que nossos visitantes dizem sobre os lugares e experiências
              na cidade.
            </p>
          </div>

          <div className="rating-summary">
            <div className="rating-number">
              <span>⭐</span>
              <strong>4,8</strong>
              <p>Excelente</p>
              <small>Baseado em 1.248 avaliações</small>
            </div>

            <div className="rating-bars">
              <div className="bar-row">
                <span>5 ★</span>
                <div className="bar">
                  <div className="fill fill-5"></div>
                </div>
                <small>856</small>
              </div>

              <div className="bar-row">
                <span>4 ★</span>
                <div className="bar">
                  <div className="fill fill-4"></div>
                </div>
                <small>298</small>
              </div>

              <div className="bar-row">
                <span>3 ★</span>
                <div className="bar">
                  <div className="fill fill-3"></div>
                </div>
                <small>68</small>
              </div>

              <div className="bar-row">
                <span>2 ★</span>
                <div className="bar">
                  <div className="fill fill-2"></div>
                </div>
                <small>16</small>
              </div>

              <div className="bar-row">
                <span>1 ★</span>
                <div className="bar">
                  <div className="fill fill-1"></div>
                </div>
                <small>10</small>
              </div>
            </div>
          </div>
        </section>

        <section className="avaliacoes-filter-card">
          <div className="avaliacoes-search">
            <span>🔍</span>
            <input type="text" placeholder="Buscar avaliações..." />
          </div>

          <div className="avaliacoes-filter-box">
            <label>Categoria</label>
            <select>
              <option>Todas</option>
              <option>Histórico</option>
              <option>Natureza</option>
              <option>Cultura</option>
              <option>Gastronomia</option>
            </select>
          </div>

          <div className="avaliacoes-filter-box">
            <label>Ordenar por</label>
            <select>
              <option>Mais recentes</option>
              <option>Melhor avaliadas</option>
              <option>Menor avaliação</option>
            </select>
          </div>

          <button className="filter-button">⚙ Filtrar</button>
        </section>

        <section className="reviews-grid">
          {avaliacoes.map((avaliacao) => (
            <article className="review-card" key={avaliacao.nome}>
              <div className="review-header">
                <img src={avaliacao.imagem} alt={avaliacao.nome} />

                <div>
                  <h2>{avaliacao.nome}</h2>
                  <p>{avaliacao.lugar}</p>
                </div>
              </div>

              <div className="review-rating-row">
                <div className="stars">
                  {"★".repeat(avaliacao.nota)}
                </div>

                <span>{avaliacao.data}</span>
              </div>

              <p className="review-text">{avaliacao.texto}</p>

              <span
                className={`review-category ${avaliacao.categoria
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")}`}
              >
                {avaliacao.categoria}
              </span>
            </article>
          ))}
        </section>

        <div className="ver-mais-avaliacoes">
          <button>Ver mais avaliações</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Avaliacoes;