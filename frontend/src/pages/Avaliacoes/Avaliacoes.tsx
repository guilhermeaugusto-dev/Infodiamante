import { useEffect, useMemo, useState } from "react";

import "./Avaliacoes.css";
import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

import {
  listarAvaliacoes,
  type Avaliacao,
} from "../../servicos/avaliacaoService";

function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("recentes");

  useEffect(() => {
    async function carregarAvaliacoes() {
      try {
        const data = await listarAvaliacoes();

        console.log("Avaliações:", data);

        setAvaliacoes(data);
      } catch (error) {
        console.log("Erro ao carregar avaliações:", error);
        setErro("Erro ao carregar avaliações.");
      } finally {
        setCarregando(false);
      }
    }

    carregarAvaliacoes();
  }, []);

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  const mediaAvaliacoes = useMemo(() => {
    if (avaliacoes.length === 0) return "0,0";

    const soma = avaliacoes.reduce((total, avaliacao) => {
      return total + Number(avaliacao.nota || 0);
    }, 0);

    return (soma / avaliacoes.length).toFixed(1).replace(".", ",");
  }, [avaliacoes]);

  const contagemNotas = useMemo(() => {
    return {
      5: avaliacoes.filter((avaliacao) => avaliacao.nota === 5).length,
      4: avaliacoes.filter((avaliacao) => avaliacao.nota === 4).length,
      3: avaliacoes.filter((avaliacao) => avaliacao.nota === 3).length,
      2: avaliacoes.filter((avaliacao) => avaliacao.nota === 2).length,
      1: avaliacoes.filter((avaliacao) => avaliacao.nota === 1).length,
    };
  }, [avaliacoes]);

  function porcentagemNota(nota: 1 | 2 | 3 | 4 | 5) {
    if (avaliacoes.length === 0) return 0;

    return (contagemNotas[nota] / avaliacoes.length) * 100;
  }

  const categorias = useMemo(() => {
    const lista = avaliacoes
      .map((avaliacao) => avaliacao.pontoTuristico?.categoria?.nome)
      .filter(Boolean) as string[];

    return Array.from(new Set(lista));
  }, [avaliacoes]);

  const avaliacoesFiltradas = useMemo(() => {
    let resultado = [...avaliacoes];

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();

      resultado = resultado.filter((avaliacao) => {
        return (
          avaliacao.usuario?.nome.toLowerCase().includes(termo) ||
          avaliacao.pontoTuristico?.nome.toLowerCase().includes(termo) ||
          avaliacao.comentario.toLowerCase().includes(termo)
        );
      });
    }

    if (categoriaSelecionada !== "todas") {
      resultado = resultado.filter(
        (avaliacao) =>
          avaliacao.pontoTuristico?.categoria?.nome === categoriaSelecionada
      );
    }

    if (ordenacao === "recentes") {
      resultado.sort(
        (a, b) =>
          new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
      );
    }

    if (ordenacao === "melhor") {
      resultado.sort((a, b) => b.nota - a.nota);
    }

    if (ordenacao === "menor") {
      resultado.sort((a, b) => a.nota - b.nota);
    }

    return resultado;
  }, [avaliacoes, busca, categoriaSelecionada, ordenacao]);

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
              <strong>{mediaAvaliacoes}</strong>
              <p>
                {avaliacoes.length > 0 ? "Excelente" : "Sem avaliações"}
              </p>
              <small>
                Baseado em {avaliacoes.length}{" "}
                {avaliacoes.length === 1 ? "avaliação" : "avaliações"}
              </small>
            </div>

            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((nota) => (
                <div className="bar-row" key={nota}>
                  <span>{nota} ★</span>

                  <div className="bar">
                    <div
                      className="fill"
                      style={{
                        width: `${porcentagemNota(nota as 1 | 2 | 3 | 4 | 5)}%`,
                      }}
                    ></div>
                  </div>

                  <small>{contagemNotas[nota as 1 | 2 | 3 | 4 | 5]}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="avaliacoes-filter-card">
          <div className="avaliacoes-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar avaliações..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="avaliacoes-filter-box">
            <label>Categoria</label>
            <select
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
            >
              <option value="todas">Todas</option>

              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="avaliacoes-filter-box">
            <label>Ordenar por</label>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="recentes">Mais recentes</option>
              <option value="melhor">Melhor avaliadas</option>
              <option value="menor">Menor avaliação</option>
            </select>
          </div>

          <button type="button" className="filter-button">
            ⚙ Filtrar
          </button>
        </section>

        {carregando ? (
          <div className="avaliacoes-empty">
            <h2>Carregando avaliações...</h2>
          </div>
        ) : erro ? (
          <div className="avaliacoes-empty">
            <h2>{erro}</h2>
          </div>
        ) : avaliacoesFiltradas.length === 0 ? (
          <div className="avaliacoes-empty">
            <h2>Nenhuma avaliação encontrada</h2>
            <p>Tente alterar os filtros ou buscar por outro termo.</p>
          </div>
        ) : (
          <section className="reviews-grid">
            {avaliacoesFiltradas.map((avaliacao) => (
              <article className="review-card" key={avaliacao.id}>
                <div className="review-header">
                  <img
                    src={
                      avaliacao.usuario?.fotoUrl ||
                      "https://ui-avatars.com/api/?name=Usuario&background=800020&color=fff"
                    }
                    alt={avaliacao.usuario?.nome || "Usuário"}
                  />

                  <div>
                    <h2>{avaliacao.usuario?.nome || "Usuário"}</h2>
                    <p>
                      Visitou{" "}
                      {avaliacao.pontoTuristico?.nome ||
                        "ponto turístico não informado"}
                    </p>
                  </div>
                </div>

                <div className="review-rating-row">
                  <div className="stars">
                    {"★".repeat(avaliacao.nota)}
                    {"☆".repeat(5 - avaliacao.nota)}
                  </div>

                  <span>{formatarData(avaliacao.criadoEm)}</span>
                </div>

                <p className="review-text">{avaliacao.comentario}</p>

                <span
                  className={`review-category ${
                    avaliacao.pontoTuristico?.categoria?.nome
                      ?.toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "") || "categoria"
                  }`}
                >
                  {avaliacao.pontoTuristico?.categoria?.nome ||
                    "Sem categoria"}
                </span>
              </article>
            ))}
          </section>
        )}

        {avaliacoesFiltradas.length > 0 && (
          <div className="ver-mais-avaliacoes">
            <button type="button">Ver mais avaliações</button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Avaliacoes;