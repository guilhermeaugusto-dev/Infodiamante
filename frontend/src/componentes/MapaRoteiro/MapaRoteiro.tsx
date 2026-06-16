import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { Save, X } from "lucide-react";

import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

import {
  listarPontosTuristicos,
  type PontoTuristico,
} from "../../servicos/pontoTuristicoService";

import { criarRoteiro } from "../../servicos/roteiroService";
import { listarGuias, type Guia } from "../../servicos/guiaService";

import "leaflet/dist/leaflet.css";
import "./MapaRoteiro.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type DadosRoteiroState = {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  quantidadePessoas: number;
  orcamento: string;
  categoriasSelecionadas: string[];
  destinoSelecionado?: string;
  pontosSelecionados?: PontoTuristico[];
};

const STORAGE_KEY = "pontosSelecionados";

function MapaRoteiro() {
  const location = useLocation();
  const navigate = useNavigate();

  const dadosRoteiro = location.state as DadosRoteiroState | null;

  const [etapa, setEtapa] = useState(2);
  const [pontos, setPontos] = useState<PontoTuristico[]>([]);

  const [pontosSelecionados, setPontosSelecionados] = useState<
    PontoTuristico[]
  >(() => {
    const pontosVindosDaNavegacao = (
      location.state as DadosRoteiroState | null
    )?.pontosSelecionados;

    if (pontosVindosDaNavegacao && pontosVindosDaNavegacao.length > 0) {
      return pontosVindosDaNavegacao;
    }

    const salvos = localStorage.getItem(STORAGE_KEY);

    if (salvos) {
      try {
        return JSON.parse(salvos);
      } catch {
        return [];
      }
    }

    return [];
  });

  const [guias, setGuias] = useState<Guia[]>([]);
  const [desejaGuia, setDesejaGuia] = useState(false);
  const [guiaSelecionadoId, setGuiaSelecionadoId] = useState("");
  const [horasGuia, setHorasGuia] = useState("1");

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pontosSelecionados));
  }, [pontosSelecionados]);

  useEffect(() => {
    if (!dadosRoteiro) {
      navigate("/criarRoteiro");
      return;
    }

    async function carregarDados() {
      try {
        const pontosData = await listarPontosTuristicos();

        const pontosComCoordenadas = pontosData.filter((ponto) => {
          const latitude = Number(ponto.latitude);
          const longitude = Number(ponto.longitude);

          return (
            ponto.latitude !== null &&
            ponto.latitude !== undefined &&
            ponto.longitude !== null &&
            ponto.longitude !== undefined &&
            !Number.isNaN(latitude) &&
            !Number.isNaN(longitude)
          );
        });

        setPontos(pontosComCoordenadas);

        const guiasData = await listarGuias();
        setGuias(guiasData);
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
        setMensagem("Erro ao carregar pontos turísticos ou guias.");
      }
    }

    carregarDados();
  }, [dadosRoteiro, navigate]);

  if (!dadosRoteiro) return null;

  function selecionarPonto(ponto: PontoTuristico) {
    const jaSelecionado = pontosSelecionados.some(
      (item) => item.id === ponto.id
    );

    if (jaSelecionado) {
      setPontosSelecionados((lista) =>
        lista.filter((item) => item.id !== ponto.id)
      );
      return;
    }

    setPontosSelecionados((lista) => [...lista, ponto]);
  }

  function removerPonto(id: number) {
    setPontosSelecionados((lista) => lista.filter((ponto) => ponto.id !== id));
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function voltarParaCategorias() {
    navigate("/criarRoteiro", {
      state: {
        titulo: dadosRoteiro.titulo,
        descricao: dadosRoteiro.descricao,
        dataInicio: dadosRoteiro.dataInicio,
        dataFim: dadosRoteiro.dataFim,
        quantidadePessoas: dadosRoteiro.quantidadePessoas,
        orcamento: dadosRoteiro.orcamento,
        categoriasSelecionadas: dadosRoteiro.categoriasSelecionadas || [],
        destinoSelecionado: dadosRoteiro.destinoSelecionado,
        pontosSelecionados,
      },
    });
  }

  function calcularTotalIngressos() {
    return pontosSelecionados.reduce((total, ponto) => {
      return (
        total +
        Number(ponto.valorIngresso || 0) *
          Number(dadosRoteiro.quantidadePessoas || 1)
      );
    }, 0);
  }

  const guiaSelecionado = guias.find(
    (guia) => String(guia.id) === guiaSelecionadoId
  );

  function calcularValorGuia() {
    if (!desejaGuia || !guiaSelecionado) return 0;

    return Number(guiaSelecionado.precoPorHora || 0) * Number(horasGuia || 1);
  }

  function calcularValorTotal() {
    return calcularTotalIngressos() + calcularValorGuia();
  }

  function irParaDetalhes() {
    if (pontosSelecionados.length === 0) {
      setMensagem("Selecione pelo menos um ponto turístico.");
      return;
    }

    setMensagem("");
    setEtapa(3);
  }

  function irParaRevisao() {
    if (desejaGuia && !guiaSelecionadoId) {
      setMensagem("Selecione um guia ou marque que não deseja guia.");
      return;
    }

    setMensagem("");
    setEtapa(4);
  }

  function montarUrlGoogleMapsSemLocalizacao() {
    const pontosValidos = pontosSelecionados.filter((ponto) => {
      const latitude = Number(ponto.latitude);
      const longitude = Number(ponto.longitude);

      return (
        ponto.latitude !== null &&
        ponto.latitude !== undefined &&
        ponto.longitude !== null &&
        ponto.longitude !== undefined &&
        !Number.isNaN(latitude) &&
        !Number.isNaN(longitude)
      );
    });

    if (pontosValidos.length === 0) {
      return "";
    }

    if (pontosValidos.length === 1) {
      const ponto = pontosValidos[0];

      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${Number(ponto.latitude)},${Number(ponto.longitude)}`
      )}`;
    }

    const primeiroPonto = pontosValidos[0];
    const ultimoPonto = pontosValidos[pontosValidos.length - 1];
    const pontosIntermediarios = pontosValidos.slice(1, -1);

    const origem = `${Number(primeiroPonto.latitude)},${Number(
      primeiroPonto.longitude
    )}`;

    const destino = `${Number(ultimoPonto.latitude)},${Number(
      ultimoPonto.longitude
    )}`;

    const waypoints = pontosIntermediarios
      .map((ponto) => `${Number(ponto.latitude)},${Number(ponto.longitude)}`)
      .join("|");

    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origem
    )}&destination=${encodeURIComponent(destino)}&travelmode=driving`;

    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }

    return url;
  }

  function abrirGoogleMapsDepoisDeSalvar() {
    const pontosValidos = pontosSelecionados.filter((ponto) => {
      const latitude = Number(ponto.latitude);
      const longitude = Number(ponto.longitude);

      return (
        ponto.latitude !== null &&
        ponto.latitude !== undefined &&
        ponto.longitude !== null &&
        ponto.longitude !== undefined &&
        !Number.isNaN(latitude) &&
        !Number.isNaN(longitude)
      );
    });

    if (pontosValidos.length === 0) {
      setMensagem("Roteiro salvo, mas nenhum ponto possui coordenadas válidas.");
      return;
    }

    const abrirSemLocalizacao = () => {
      const url = montarUrlGoogleMapsSemLocalizacao();

      if (!url) {
        setMensagem("Não foi possível montar a rota no Google Maps.");
        return;
      }

      window.location.href = url;
    };

    if (!navigator.geolocation) {
      abrirSemLocalizacao();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const minhaLatitude = position.coords.latitude;
        const minhaLongitude = position.coords.longitude;

        const origem = `${minhaLatitude},${minhaLongitude}`;
        const ultimoPonto = pontosValidos[pontosValidos.length - 1];

        const destino = `${Number(ultimoPonto.latitude)},${Number(
          ultimoPonto.longitude
        )}`;

        const pontosIntermediarios = pontosValidos
          .slice(0, -1)
          .map(
            (ponto) => `${Number(ponto.latitude)},${Number(ponto.longitude)}`
          )
          .join("|");

        let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
          origem
        )}&destination=${encodeURIComponent(destino)}&travelmode=driving`;

        if (pontosIntermediarios) {
          url += `&waypoints=${encodeURIComponent(pontosIntermediarios)}`;
        }

        window.location.href = url;
      },
      () => {
        abrirSemLocalizacao();
      }
    );
  }

  async function salvarRoteiro() {
    if (pontosSelecionados.length === 0) {
      setMensagem("Selecione pelo menos um ponto turístico.");
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");

      await criarRoteiro({
        titulo: dadosRoteiro.titulo,
        descricao: dadosRoteiro.descricao,
        dataInicio: dadosRoteiro.dataInicio,
        dataFim: dadosRoteiro.dataFim,
        quantidadePessoas: dadosRoteiro.quantidadePessoas,
        orcamento: String(calcularValorTotal()),
        pontos: pontosSelecionados.map((ponto, index) => ({
          pontoTuristicoId: ponto.id,
          ordemVisita: index + 1,
        })),
      });

      localStorage.removeItem(STORAGE_KEY);

      setMensagem("Roteiro criado com sucesso! Abrindo Google Maps...");

      abrirGoogleMapsDepoisDeSalvar();
    } catch (error) {
      console.log("Erro ao salvar roteiro:", error);

      setMensagem(
        error instanceof Error ? error.message : "Erro ao salvar roteiro."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mapa-roteiro-page">
      <Navbar />

      <main className="mapa-roteiro-main">
        <section className="mapa-roteiro-header">
          <div>
            <h1>Criar Roteiro</h1>
            <p>
              Roteiro: <strong>{dadosRoteiro.titulo}</strong> | Categorias:{" "}
              <strong>
                {dadosRoteiro.categoriasSelecionadas?.join(", ")}
              </strong>
            </p>
          </div>

          <div className="steps">
            <div className="step active">
              <div className="step-icon">📍</div>
              <span>1. Destino</span>
            </div>

            <div className="step-line"></div>

            <div className={`step ${etapa >= 2 ? "active" : ""}`}>
              <div className="step-icon">🏛️</div>
              <span>2. Atrações</span>
            </div>

            <div className="step-line"></div>

            <div className={`step ${etapa >= 3 ? "active" : ""}`}>
              <div className="step-icon">📋</div>
              <span>3. Detalhes</span>
            </div>

            <div className="step-line"></div>

            <div className={`step ${etapa >= 4 ? "active" : ""}`}>
              <div className="step-icon">✅</div>
              <span>4. Revisão</span>
            </div>
          </div>
        </section>

        {mensagem && <p className="mapa-mensagem">{mensagem}</p>}

        {etapa === 2 && (
          <section className="mapa-roteiro-layout">
            <div className="mapa-area">
              <MapContainer
                center={[-18.2411, -43.6031]}
                zoom={14}
                className="mapa-container"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {pontos.map((ponto) => {
                  const selecionado = pontosSelecionados.some(
                    (item) => item.id === ponto.id
                  );

                  return (
                    <Marker
                      key={ponto.id}
                      position={[
                        Number(ponto.latitude),
                        Number(ponto.longitude),
                      ]}
                    >
                      <Popup>
                        <div className="mapa-popup">
                          <strong>{ponto.nome}</strong>

                          <p>
                            Ingresso:{" "}
                            {formatarMoeda(Number(ponto.valorIngresso || 0))}
                          </p>

                          <small>
                            ♿{" "}
                            {ponto.acessivel
                              ? "Acessível"
                              : "Não acessível"}
                          </small>

                          <button
                            type="button"
                            onClick={() => selecionarPonto(ponto)}
                          >
                            {selecionado
                              ? "Remover do roteiro"
                              : "Adicionar ao roteiro"}
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            <aside className="mapa-sidebar">
              <h2>Pontos selecionados</h2>

              {pontosSelecionados.length === 0 ? (
                <p>Nenhum ponto selecionado.</p>
              ) : (
                pontosSelecionados.map((ponto, index) => (
                  <div className="mapa-ponto-item" key={ponto.id}>
                    <span>{index + 1}</span>

                    <div>
                      <strong>{ponto.nome}</strong>
                      <small>
                        Ingresso:{" "}
                        {formatarMoeda(Number(ponto.valorIngresso || 0))}
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={() => removerPonto(ponto.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}

              <div className="mapa-sidebar-actions">
                <button
                  type="button"
                  className="mapa-voltar-button"
                  onClick={voltarParaCategorias}
                >
                  ← Voltar para categorias
                </button>

                <button
                  type="button"
                  className="mapa-salvar-button"
                  onClick={irParaDetalhes}
                >
                  Continuar para detalhes
                </button>
              </div>
            </aside>
          </section>
        )}

        {etapa === 3 && (
          <section className="roteiro-detalhes-card">
            <h2>Detalhes do roteiro</h2>

            <div className="guia-opcao-box">
              <h3>Deseja contratar um guia?</h3>
              <p>
                O guia pode acompanhar o roteiro e ajudar durante a visita aos
                pontos turísticos.
              </p>

              <div className="guia-opcao-actions">
                <button
                  type="button"
                  className={desejaGuia ? "active" : ""}
                  onClick={() => setDesejaGuia(true)}
                >
                  Sim, quero guia
                </button>

                <button
                  type="button"
                  className={!desejaGuia ? "active" : ""}
                  onClick={() => {
                    setDesejaGuia(false);
                    setGuiaSelecionadoId("");
                    setHorasGuia("1");
                  }}
                >
                  Não quero guia
                </button>
              </div>
            </div>

            {desejaGuia && (
              <div className="guia-lista-box">
                <label>Escolha o guia</label>

                <select
                  value={guiaSelecionadoId}
                  onChange={(e) => setGuiaSelecionadoId(e.target.value)}
                >
                  <option value="">Selecione um guia</option>

                  {guias.map((guia) => (
                    <option key={guia.id} value={guia.id}>
                      {guia.usuario?.nome || "Guia"} -{" "}
                      {formatarMoeda(Number(guia.precoPorHora || 0))}/hora
                    </option>
                  ))}
                </select>

                <label>Quantidade de horas</label>

                <input
                  type="number"
                  min="1"
                  value={horasGuia}
                  onChange={(e) => setHorasGuia(e.target.value)}
                />

                {guiaSelecionado && (
                  <div className="guia-selecionado-box">
                    <strong>{guiaSelecionado.usuario?.nome}</strong>
                    <p>{guiaSelecionado.especialidade}</p>
                    <span>
                      Valor do serviço: {formatarMoeda(calcularValorGuia())}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="continue-area">
              <button type="button" onClick={() => setEtapa(2)}>
                Voltar
              </button>

              <button type="button" onClick={irParaRevisao}>
                Continuar para revisão
              </button>
            </div>
          </section>
        )}

        {etapa === 4 && (
          <section className="roteiro-revisao-card">
            <h2>Revisão do roteiro</h2>

            <div className="revisao-info">
              <p>
                <strong>Roteiro:</strong> {dadosRoteiro.titulo}
              </p>

              <p>
                <strong>Quantidade de pessoas:</strong>{" "}
                {dadosRoteiro.quantidadePessoas}
              </p>

              <p>
                <strong>Destino:</strong>{" "}
                {dadosRoteiro.destinoSelecionado || "Diamantina"}
              </p>

              <p>
                <strong>Guia:</strong>{" "}
                {desejaGuia
                  ? guiaSelecionado?.usuario?.nome || "Guia selecionado"
                  : "Não contratado"}
              </p>
            </div>

            <div className="revisao-pontos">
              <h3>Pontos selecionados</h3>

              {pontosSelecionados.map((ponto) => (
                <div className="revisao-ponto" key={ponto.id}>
                  <div>
                    <strong>{ponto.nome}</strong>

                    <span>
                      Ingresso:{" "}
                      {formatarMoeda(Number(ponto.valorIngresso || 0))} por
                      pessoa
                    </span>

                    <small>
                      ♿ {ponto.acessivel ? "Acessível" : "Não acessível"}
                    </small>
                  </div>

                  <strong>
                    {formatarMoeda(
                      Number(ponto.valorIngresso || 0) *
                        Number(dadosRoteiro.quantidadePessoas || 1)
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="revisao-total">
              <div>
                <span>Total de ingressos</span>
                <strong>{formatarMoeda(calcularTotalIngressos())}</strong>
              </div>

              <div>
                <span>Serviço do guia</span>
                <strong>{formatarMoeda(calcularValorGuia())}</strong>
              </div>

              <div className="total-final">
                <span>Total estimado</span>
                <strong>{formatarMoeda(calcularValorTotal())}</strong>
              </div>
            </div>

            <div className="continue-area">
              <button type="button" onClick={() => setEtapa(3)}>
                Voltar
              </button>

              <button
                type="button"
                onClick={salvarRoteiro}
                disabled={carregando}
              >
                <Save size={18} />
                {carregando ? "Salvando..." : "Finalizar roteiro"}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MapaRoteiro;