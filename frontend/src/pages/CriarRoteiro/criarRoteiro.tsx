import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  listarCategorias,
  type Categoria,
} from "../../servicos/categoriaService";

import "./criarRoteiro.css";
import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

function CriarRoteiro() {
  const navigate = useNavigate();
  const location = useLocation();

  const dadosRecebidos = location.state as any;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  const [titulo, setTitulo] = useState(dadosRecebidos?.titulo || "");
  const [descricao, setDescricao] = useState(dadosRecebidos?.descricao || "");
  const [dataInicio, setDataInicio] = useState(
    dadosRecebidos?.dataInicio || ""
  );
  const [dataFim, setDataFim] = useState(dadosRecebidos?.dataFim || "");

  const [quantidadePessoas, setQuantidadePessoas] = useState(
    dadosRecebidos?.quantidadePessoas || 2
  );

  const [orcamento, setOrcamento] = useState(dadosRecebidos?.orcamento || "");

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    string[]
  >(dadosRecebidos?.categoriasSelecionadas || []);

  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarCategorias() {
      try {
        setCarregandoCategorias(true);

        const data = await listarCategorias();

        setCategorias(data);
      } catch (error) {
        console.log("Erro ao carregar categorias:", error);
        setMensagem("Erro ao carregar categorias.");
      } finally {
        setCarregandoCategorias(false);
      }
    }

    carregarCategorias();
  }, []);

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function diminuirPessoas() {
    if (quantidadePessoas > 1) {
      setQuantidadePessoas(quantidadePessoas - 1);
    }
  }

  function aumentarPessoas() {
    setQuantidadePessoas(quantidadePessoas + 1);
  }

  function alternarCategoria(nome: string) {
    setCategoriasSelecionadas((categoriasAtuais) => {
      const jaSelecionada = categoriasAtuais.includes(nome);

      if (jaSelecionada) {
        return categoriasAtuais.filter((categoria) => categoria !== nome);
      }

      return [...categoriasAtuais, nome];
    });
  }

  function buscarDescricaoCategoria(nome: string) {
    const nomeFormatado = nome.toLowerCase();

    if (nomeFormatado.includes("hist")) {
      return "Patrimônio, cultura e história";
    }

    if (nomeFormatado.includes("relig")) {
      return "Igrejas, capelas e tradições religiosas";
    }

    if (nomeFormatado.includes("cultura")) {
      return "Museus, eventos e manifestações culturais";
    }

    if (nomeFormatado.includes("natureza")) {
      return "Paisagens, parques e áreas naturais";
    }

    if (nomeFormatado.includes("gastronomia")) {
      return "Comidas típicas, restaurantes e sabores locais";
    }

    if (nomeFormatado.includes("mirante")) {
      return "Vista panorâmica e pontos para fotos";
    }

    if (nomeFormatado.includes("museu")) {
      return "Acervos, história e conhecimento";
    }

    if (nomeFormatado.includes("cachoeira")) {
      return "Banho, natureza e aventura";
    }

    if (nomeFormatado.includes("trilha")) {
      return "Caminhadas, ecoturismo e aventura";
    }

    if (nomeFormatado.includes("lazer")) {
      return "Passeios, praças e espaços públicos";
    }

    if (nomeFormatado.includes("arquitetura")) {
      return "Construções, casarões e monumentos";
    }

    return "Categoria turística disponível para o roteiro";
  }

  function buscarImagemCategoria(nome: string) {
    const nomeFormatado = nome.toLowerCase();

    if (nomeFormatado.includes("hist")) {
      return "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("relig")) {
      return "https://images.unsplash.com/photo-1548625361-58a9b86aa83b?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("cultura")) {
      return "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("natureza")) {
      return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("gastronomia")) {
      return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("mirante")) {
      return "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("museu")) {
      return "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("cachoeira")) {
      return "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("trilha")) {
      return "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=700&q=80";
    }

    if (nomeFormatado.includes("arquitetura")) {
      return "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80";
    }

    return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80";
  }

  function continuarParaMapa() {
    if (!titulo.trim()) {
      setMensagem("Informe o nome do roteiro.");
      return;
    }

    if (categoriasSelecionadas.length === 0) {
      setMensagem("Selecione pelo menos uma categoria.");
      return;
    }

    setMensagem("");

    navigate("/mapa-roteiro", {
      state: {
        titulo,
        descricao,
        dataInicio,
        dataFim,
        quantidadePessoas,
        orcamento,
        categoriasSelecionadas,
      },
    });
  }

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
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Fim de semana cultural"
                />
              </div>

              <div className="form-field">
                <label>Descrição opcional</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Conte um pouco sobre seu roteiro..."
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Data de início</label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Data de término</label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Acompanhantes</label>

                  <div className="people-control">
                    <button type="button" onClick={diminuirPessoas}>
                      −
                    </button>

                    <span>{quantidadePessoas}</span>

                    <button type="button" onClick={aumentarPessoas}>
                      +
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label>Orçamento total</label>
                  <input
                    type="number"
                    value={orcamento}
                    onChange={(e) => setOrcamento(e.target.value)}
                    placeholder="R$ 0,00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Categorias selecionadas</label>

                <div className="categorias-selecionadas">
                  {categoriasSelecionadas.length === 0 ? (
                    <span>Nenhuma categoria selecionada</span>
                  ) : (
                    categoriasSelecionadas.map((categoria) => (
                      <button
                        type="button"
                        key={categoria}
                        onClick={() => alternarCategoria(categoria)}
                      >
                        {categoria} ×
                      </button>
                    ))
                  )}
                </div>
              </div>
            </form>
          </aside>

          <section className="destino-card">
            <div className="destino-title">
              <div>
                <h2>Escolha as categorias</h2>
                <p>Selecione uma ou mais categorias para montar seu roteiro.</p>
              </div>

              <div className="search-destino">
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar categoria..."
                />
                <span>🔍</span>
              </div>
            </div>

            <div className="destinos-grid">
              {carregandoCategorias ? (
                <div className="roteiro-message">
                  Carregando categorias...
                </div>
              ) : categoriasFiltradas.length === 0 ? (
                <div className="roteiro-message">
                  Nenhuma categoria encontrada.
                </div>
              ) : (
                categoriasFiltradas.map((categoria) => {
                  const selecionada = categoriasSelecionadas.includes(
                    categoria.nome
                  );

                  return (
                    <article
                      className={`destino-item ${
                        selecionada ? "active" : ""
                      }`}
                      key={categoria.id}
                      onClick={() => alternarCategoria(categoria.nome)}
                    >
                      <div className="destino-image">
                        <img
                          src={buscarImagemCategoria(categoria.nome)}
                          alt={categoria.nome}
                        />

                        {selecionada && <span className="check">✓</span>}
                      </div>

                      <div className="destino-info">
                        <h3>📍 {categoria.nome}</h3>
                        <p>{buscarDescricaoCategoria(categoria.nome)}</p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {mensagem && <p className="roteiro-message">{mensagem}</p>}

            <div className="continue-area">
              <button type="button" onClick={continuarParaMapa}>
                Continuar para o mapa ➜
              </button>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CriarRoteiro;