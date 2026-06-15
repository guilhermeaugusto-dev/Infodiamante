import { useEffect, useMemo, useState } from "react";
import { listarGuias, buscarGuiaPorId, type Guia } from "../../servicos/guiaService";
import GuiaModal from "../../componentes/GuiaModal/GuiaModal";

import "./Guias.css";
import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

function Guias() {
  const [guias, setGuias] = useState<Guia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [guiaSelecionado, setGuiaSelecionado] = useState<Guia | null>(null);
const [carregandoGuia, setCarregandoGuia] = useState(false);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState("todas");
  const [idiomaSelecionado, setIdiomaSelecionado] = useState("todos");
  const [regiaoSelecionada, setRegiaoSelecionada] = useState("todas");

  useEffect(() => {
    async function carregarGuias() {
      try {
        const data = await listarGuias();

        console.log("Guias:", data);

        setGuias(data);
      } catch (error) {
        console.log("Erro ao carregar guias:", error);
        setErro("Erro ao carregar guias.");
      } finally {
        setCarregando(false);
      }
    }

    carregarGuias();
  }, []);
  

  const especialidades = useMemo(() => {
    const lista = guias.map((guia) => guia.especialidade).filter(Boolean);

    return Array.from(new Set(lista));
  }, [guias]);

  const idiomas = useMemo(() => {
    const lista = guias
      .flatMap((guia) => {
        if (!guia.idiomas) return [];

        return guia.idiomas.split(",").map((idioma) => idioma.trim());
      })
      .filter(Boolean);

    return Array.from(new Set(lista));
  }, [guias]);

  const regioes = useMemo(() => {
    const lista = guias
      .map((guia) => guia.usuario?.cidade)
      .filter(Boolean) as string[];

    return Array.from(new Set(lista));
  }, [guias]);

  const guiasFiltrados = useMemo(() => {
    let resultado = [...guias];

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();

      resultado = resultado.filter((guia) => {
        return (
          guia.usuario?.nome.toLowerCase().includes(termo) ||
          guia.especialidade.toLowerCase().includes(termo) ||
          guia.biografia?.toLowerCase().includes(termo)
        );
      });
    }

    if (especialidadeSelecionada !== "todas") {
      resultado = resultado.filter(
        (guia) => guia.especialidade === especialidadeSelecionada
      );
    }

    if (idiomaSelecionado !== "todos") {
      resultado = resultado.filter((guia) =>
        guia.idiomas
          ?.toLowerCase()
          .includes(idiomaSelecionado.toLowerCase())
      );
    }

    if (regiaoSelecionada !== "todas") {
      resultado = resultado.filter(
        (guia) => guia.usuario?.cidade === regiaoSelecionada
      );
    }

    return resultado;
  }, [
    guias,
    busca,
    especialidadeSelecionada,
    idiomaSelecionado,
    regiaoSelecionada,
  ]);
  async function abrirPerfilGuia(id: number) {
  try {
    setCarregandoGuia(true);

    const guiaCompleto = await buscarGuiaPorId(id);

    setGuiaSelecionado(guiaCompleto);
  } catch (error) {
    console.log("Erro ao buscar perfil do guia:", error);
  } finally {
    setCarregandoGuia(false);
  }
}

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
            <input
              type="text"
              placeholder="Buscar por nome do guia..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="guia-filter-box">
            <label>Especialidade</label>
            <select
              value={especialidadeSelecionada}
              onChange={(e) => setEspecialidadeSelecionada(e.target.value)}
            >
              <option value="todas">Todas</option>

              {especialidades.map((especialidade) => (
                <option key={especialidade} value={especialidade}>
                  {especialidade}
                </option>
              ))}
            </select>
          </div>

          <div className="guia-filter-box">
            <label>Idiomas</label>
            <select
              value={idiomaSelecionado}
              onChange={(e) => setIdiomaSelecionado(e.target.value)}
            >
              <option value="todos">Todos</option>

              {idiomas.map((idioma) => (
                <option key={idioma} value={idioma}>
                  {idioma}
                </option>
              ))}
            </select>
          </div>

          <div className="guia-filter-box">
            <label>Região</label>
            <select
              value={regiaoSelecionada}
              onChange={(e) => setRegiaoSelecionada(e.target.value)}
            >
              <option value="todas">Todas</option>

              {regioes.map((regiao) => (
                <option key={regiao} value={regiao}>
                  {regiao}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="guia-search-button">
            🔍 Buscar
          </button>
        </section>

        {carregando ? (
          <div className="guias-empty">
            <h2>Carregando guias...</h2>
          </div>
        ) : erro ? (
          <div className="guias-empty">
            <h2>{erro}</h2>
          </div>
        ) : guiasFiltrados.length === 0 ? (
          <div className="guias-empty">
            <h2>Nenhum guia encontrado</h2>
            <p>Tente alterar os filtros ou buscar por outro nome.</p>
          </div>
        ) : (
          <section className="guias-grid">
            {guiasFiltrados.map((guia) => (
              <article className="guia-card" key={guia.id}>
                <div className="guia-image">
                  <img
                    src={
                      guia.imagemUrl ||
                      guia.usuario?.fotoUrl ||
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80"
                    }
                    alt={guia.usuario?.nome || "Guia turístico"}
                  />

                  <button type="button" className="guia-favorite">
                    ♡
                  </button>
                </div>

                <div className="guia-content">
                  <h2>
                    {guia.usuario?.nome || "Guia turístico"}
                    {guia.verificado && <span>✓</span>}
                  </h2>

                  <strong>{guia.especialidade}</strong>

                  <p>📍 {guia.usuario?.cidade || "Região não informada"}</p>

                  <div className="guia-rating">
                    <span>⭐ 0,0</span>
                    <small>(0 avaliações)</small>
                  </div>

                  <div className="guia-info-extra">
                    {guia.anosExperiencia !== null &&
                      guia.anosExperiencia !== undefined && (
                        <small>{guia.anosExperiencia} anos de experiência</small>
                      )}
                      <br />

                    {guia.idiomas && <small>Idiomas: {guia.idiomas}</small>}
<br />  
                    {guia.precoPorHora && (
                      <small>R$ {Number(guia.precoPorHora).toFixed(2)}/hora</small>
                    )}
                  </div>

                 <button
  type="button"
  className="guia-card-button"
  onClick={() => abrirPerfilGuia(guia.id)}
>
  Ver perfil
</button>
                </div>
              </article>
            ))}
          </section>
        )}

        {guiasFiltrados.length >5 && (
          <div className="ver-mais-area">
            <button type="button">Ver mais guias</button>
          </div>
        )}
        {carregandoGuia && (
  <div className="guias-loading-modal">
    <div>Carregando perfil...</div>
  </div>
)}

<GuiaModal
  guia={guiaSelecionado}
  onFechar={() => setGuiaSelecionado(null)}
/>
      </main>

      <Footer />
    </div>
  );
}

export default Guias;