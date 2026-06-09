import "./criarRoteiro.css";
import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

function CriarRoteiro() {
  const destinos = [
    {
      nome: "Centro Histórico",
      descricao: "Patrimônio, cultura e história",
      imagem:
        "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=700&q=80",
      ativo: true,
    },
    {
      nome: "Zona Sul",
      descricao: "Praias, natureza e lazer",
      imagem:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
    },
    {
      nome: "Zona Norte",
      descricao: "Aventura, ecoturismo e cachoeiras",
      imagem:
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=700&q=80",
    },
    {
      nome: "Zona Leste",
      descricao: "Parques, cultura e eventos",
      imagem:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
    },
    {
      nome: "Zona Oeste",
      descricao: "Tradição, rural e gastronomia",
      imagem:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <div className="roteiro-page">
      <Navbar />

      <main className="roteiro-container">
        <section className="roteiro-header">
          <div>
            <h1>Criar Roteiro</h1>
            <p>
              Monte seu roteiro personalizado e viva experiências inesquecíveis
              na nossa cidade.
            </p>
          </div>

          <div className="steps">
            <div className="step active">
              <div className="step-icon">📍</div>
              <span>1. Destino</span>
            </div>

            <div className="step-line"></div>

            <div className="step">
              <div className="step-icon">🏛️</div>
              <span>2. Atrações</span>
            </div>

            <div className="step-line"></div>

            <div className="step">
              <div className="step-icon">📋</div>
              <span>3. Detalhes</span>
            </div>

            <div className="step-line"></div>

            <div className="step">
              <div className="step-icon">✅</div>
              <span>4. Revisão</span>
            </div>
          </div>
        </section>

        <section className="roteiro-content">
          <aside className="roteiro-info-card">
            <h2>Informações do roteiro</h2>

            <form>
              <div className="form-field">
                <label>Nome do roteiro</label>
                <input type="text" placeholder="Ex.: Fim de semana cultural" />
              </div>

              <div className="form-field">
                <label>Descrição opcional</label>
                <textarea placeholder="Conte um pouco sobre seu roteiro..." />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Data de início</label>
                  <input type="date" />
                </div>

                <div className="form-field">
                  <label>Data de término</label>
                  <input type="date" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Acompanhantes</label>

                  <div className="people-control">
                    <button type="button">−</button>
                    <span>2</span>
                    <button type="button">+</button>
                  </div>
                </div>

                <div className="form-field">
                  <label>Orçamento total</label>
                  <input type="text" placeholder="R$ 0,00" />
                </div>
              </div>
            </form>
          </aside>

          <section className="destino-card">
            <div className="destino-title">
              <div>
                <h2>Escolha seu destino</h2>
                <p>Selecione a cidade ou região para o seu roteiro</p>
              </div>

              <div className="search-destino">
                <input type="text" placeholder="Buscar cidade ou região..." />
                <span>🔍</span>
              </div>
            </div>

            <div className="destinos-grid">
              {destinos.map((destino) => (
                <article
                  className={`destino-item ${destino.ativo ? "active" : ""}`}
                  key={destino.nome}
                >
                  <div className="destino-image">
                    <img src={destino.imagem} alt={destino.nome} />

                    {destino.ativo && <span className="check">✓</span>}
                  </div>

                  <div className="destino-info">
                    <h3>📍 {destino.nome}</h3>
                    <p>{destino.descricao}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="continue-area">
              <button>Continuar ➜</button>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CriarRoteiro;