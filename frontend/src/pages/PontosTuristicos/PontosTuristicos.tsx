import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PontosTuristicos.css";
import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";
import imagemIgreja from "../../templates/igreja-turismo.png";
import { listarPontosTuristicos,buscarPontoTuristicoPorId } from "../../servicos/pontoTuristicoService";
import { useUser } from "../../contexts/UserContext";

import PontoTuristicoModal from "../../componentes/PontoTuristicoModal/PontoTuristicoModal";
type PontoTuristico = {
  id: number;
  nome: string;
  descricao: string;
  endereco?: string | null;
  cidade: string;
  estado: string;
  imagemUrl?: string | null;
  categoria?: {
    id: number;
    nome: string;
    cor?: string | null;
  } | null;
  regiao?: {
    id: number;
    nome: string;
  } | null;
  avaliacoes?: any[];
  favoritos?: any[];
};

function PontosTuristicos() {
  const navigate = useNavigate();
  const { usuario } = useUser();
  const [pontoSelecionado, setPontoSelecionado] =
  useState<PontoTuristico | null>(null);

const [carregandoPonto, setCarregandoPonto] = useState(false);
  const [pontos, setPontos] = useState<PontoTuristico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");
  const [regiaoSelecionada, setRegiaoSelecionada] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("mais-populares");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  useEffect(() => {
    async function carregarPontos() {
      try {
        const data = await listarPontosTuristicos();

        console.log("Pontos turísticos:", data);

        setPontos(data);
      } catch (error) {
        console.log("Erro ao carregar pontos turísticos:", error);
        setErro("Erro ao carregar pontos turísticos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarPontos();
  }, []);

  function calcularNota(ponto: PontoTuristico) {
    const avaliacoes = ponto.avaliacoes || [];

    if (avaliacoes.length === 0) {
      return 0;
    }

    const soma = avaliacoes.reduce((total, avaliacao) => {
      return total + Number(avaliacao.nota || 0);
    }, 0);

    return soma / avaliacoes.length;
  }
async function abrirDetalhesPonto(id: number) {
  try {
    setCarregandoPonto(true);

    const pontoCompleto = await buscarPontoTuristicoPorId(id);

    setPontoSelecionado(pontoCompleto);
  } catch (error) {
    console.log("Erro ao buscar detalhes do ponto:", error);
  } finally {
    setCarregandoPonto(false);
  }
}
  const categorias = useMemo(() => {
    const lista = pontos
      .map((ponto) => ponto.categoria?.nome)
      .filter(Boolean) as string[];

    return Array.from(new Set(lista));
  }, [pontos]);

  const regioes = useMemo(() => {
    const lista = pontos
      .map((ponto) => ponto.regiao?.nome || ponto.cidade)
      .filter(Boolean) as string[];

    return Array.from(new Set(lista));
  }, [pontos]);

  const pontosFiltrados = useMemo(() => {
    let resultado = [...pontos];

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();

      resultado = resultado.filter((ponto) => {
        return (
          ponto.nome.toLowerCase().includes(termo) ||
          ponto.descricao.toLowerCase().includes(termo) ||
          ponto.cidade.toLowerCase().includes(termo)
        );
      });
    }

    if (categoriaSelecionada !== "todas") {
      resultado = resultado.filter(
        (ponto) => ponto.categoria?.nome === categoriaSelecionada
      );
    }

    if (regiaoSelecionada !== "todas") {
      resultado = resultado.filter((ponto) => {
        const regiao = ponto.regiao?.nome || ponto.cidade;
        return regiao === regiaoSelecionada;
      });
    }

    if (ordenacao === "melhor-avaliados") {
      resultado.sort((a, b) => calcularNota(b) - calcularNota(a));
    }

    if (ordenacao === "mais-populares") {
      resultado.sort(
        (a, b) => (b.favoritos?.length || 0) - (a.favoritos?.length || 0)
      );
    }

    if (ordenacao === "nome") {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    return resultado;
  }, [pontos, busca, categoriaSelecionada, regiaoSelecionada, ordenacao]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, categoriaSelecionada, regiaoSelecionada, ordenacao]);

  const totalPaginas = Math.ceil(pontosFiltrados.length / itensPorPagina);

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;

  const pontosPaginados = pontosFiltrados.slice(indiceInicial, indiceFinal);

  function mudarPagina(pagina: number) {
    const token = localStorage.getItem("token");

    if (pagina > 1 && (!token || !usuario)) {
      navigate("/");
      return;
    }

    if (pagina < 1 || pagina > totalPaginas) {
      return;
    }

    setPaginaAtual(pagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


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
            <input
              type="text"
              placeholder="Buscar por nome do lugar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <label>Categoria</label>
            <select
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
            >
              <option value="todas">Todas as categorias</option>

              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-box">
            <label>Região</label>
            <select
              value={regiaoSelecionada}
              onChange={(e) => setRegiaoSelecionada(e.target.value)}
            >
              <option value="todas">Todas as regiões</option>

              {regioes.map((regiao) => (
                <option key={regiao} value={regiao}>
                  {regiao}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-box">
            <label>Ordenar por</label>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="mais-populares">Mais populares</option>
              <option value="melhor-avaliados">Melhor avaliados</option>
              <option value="nome">Nome A-Z</option>
            </select>
          </div>

          <button type="button" className="search-button">
            🔍 Buscar
          </button>


        </section>

        {carregando ? (
          <div className="pontos-empty">
            <h2>Carregando pontos turísticos...</h2>
          </div>
        ) : erro ? (
          <div className="pontos-empty">
            <h2>{erro}</h2>
          </div>
        ) : pontosFiltrados.length === 0 ? (
          <div className="pontos-empty">
            <h2>Nenhum ponto turístico encontrado</h2>
            <p>Tente alterar os filtros ou buscar por outro nome.</p>
          </div>
        ) : (
          <section className="cards-grid">
            {pontosPaginados.map((ponto) => (
              <article
  className="ponto-card"
  key={ponto.id}
  onClick={() => abrirDetalhesPonto(ponto.id)}
>
                <div className="card-image">
                  <img
                    src={
                      ponto.imagemUrl ||
                      "https://images.unsplash.com/photo-1548115184-bfa201b1a7ab?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={ponto.nome}
                  />

                  <span className="featured-badge">
                    {ponto.categoria?.nome || "Turismo"}
                  </span>

                  <button type="button" className="favorite-button">
                    ♡
                  </button>
                </div>

                <div className="card-content">
                  <h2>{ponto.nome}</h2>

                  <span
                    className={`category-tag ${
                      ponto.categoria?.nome
                        ?.toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "") || "turismo"
                    }`}
                  >
                    {ponto.categoria?.nome || "Turismo"}
                  </span>

                  <p className="ponto-descricao">
                    {ponto.descricao.length > 90
                      ? `${ponto.descricao.substring(0, 90)}...`
                      : ponto.descricao}
                  </p>

                  <div className="card-footer">
                    <span>
                      📍 {ponto.regiao?.nome || ponto.cidade || "Local"}
                    </span>

                    <strong>⭐ {calcularNota(ponto).toFixed(1)}</strong>

                    <small>({ponto.avaliacoes?.length || 0})</small>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {pontosFiltrados.length > 0 && (
          <div className="pagination">
            <button
              type="button"
              disabled={paginaAtual === 1}
              onClick={() => mudarPagina(paginaAtual - 1)}
            >
              «
            </button>

            {Array.from({ length: totalPaginas }).map((_, index) => {
              const numeroPagina = index + 1;

              return (
                <button
                  key={numeroPagina}
                  type="button"
                  className={paginaAtual === numeroPagina ? "active-page" : ""}
                  onClick={() => mudarPagina(numeroPagina)}
                >
                  {numeroPagina}
                </button>
              );
            })}

            <button
              type="button"
              disabled={paginaAtual === totalPaginas}
              onClick={() => mudarPagina(paginaAtual + 1)}
            >
              »
            </button>
          </div>
        )}
        {carregandoPonto && (
  <div className="pontos-loading-modal">
    <div>Carregando detalhes...</div>
  </div>
)}

<PontoTuristicoModal
  ponto={pontoSelecionado}
  onFechar={() => setPontoSelecionado(null)}
/>
      </main>

      <Footer />
    </div>
  );
}

export default PontosTuristicos;