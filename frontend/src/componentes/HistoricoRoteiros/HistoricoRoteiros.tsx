import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Trash2, X } from "lucide-react";

import {
  listarMeusRoteiros,
  deletarRoteiro,
  type Roteiro,
} from "../../servicos/roteiroService";

function HistoricoRoteiros() {
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [roteiroSelecionado, setRoteiroSelecionado] =
    useState<Roteiro | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarRoteiros();
  }, []);

  async function carregarRoteiros() {
    try {
      setCarregando(true);
      setErro("");

      const data = await listarMeusRoteiros();

      setRoteiros(data);
    } catch (error) {
      console.log("Erro ao carregar roteiros:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar seus roteiros."
      );
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(data?: string | null) {
    if (!data) return "Sem data";
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function formatarMoeda(valor?: string | number | null) {
    if (valor === null || valor === undefined || valor === "") {
      return "Valor não informado";
    }

    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function calcularTotalIngressos(roteiro: Roteiro) {
    const quantidadePessoas = Number(roteiro.quantidadePessoas || 1);

    const total = roteiro.pontos?.reduce((soma, item) => {
      const valor = Number(item.pontoTuristico?.valorIngresso || 0);
      return soma + valor * quantidadePessoas;
    }, 0);

    return total || 0;
  }

  async function removerRoteiro(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este roteiro?"
    );

    if (!confirmar) return;

    try {
      setMensagem("");

      await deletarRoteiro(id);

      setRoteiros((lista) => lista.filter((roteiro) => roteiro.id !== id));

      if (roteiroSelecionado?.id === id) {
        setRoteiroSelecionado(null);
      }

      setMensagem("Roteiro excluído com sucesso!");
    } catch (error) {
      console.log("Erro ao excluir roteiro:", error);

      setMensagem(
        error instanceof Error ? error.message : "Erro ao excluir roteiro."
      );
    }
  }

  if (carregando) {
    return (
      <div className="historico-empty">
        <h2>Carregando seus roteiros...</h2>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="historico-empty">
        <h2>{erro}</h2>
      </div>
    );
  }

  if (roteiros.length === 0) {
    return (
      <div className="historico-empty">
        <h2>Você ainda não criou roteiros</h2>
        <p>Quando você criar um roteiro, ele aparecerá aqui.</p>
      </div>
    );
  }

  return (
    <>
      {mensagem && (
        <div className="historico-message">
          <strong>{mensagem}</strong>
        </div>
      )}

      {roteiros.map((roteiro, index) => {
        const primeiraImagem =
          roteiro.pontos?.[0]?.pontoTuristico?.imagemUrl ||
          "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80";

        return (
          <div
            className="historico-card roteiro"
            key={`roteiro-${roteiro.id || index}`}
          >
            <div className="historico-date">
              <Calendar className="icon-xs wine-icon" />
              {formatarData(roteiro.criadoEm)}
            </div>

            <div className="historico-route-badge">Roteiro</div>

            <button
              type="button"
              className="historico-share-button"
              onClick={() => removerRoteiro(roteiro.id)}
              title="Excluir roteiro"
            >
              <Trash2 className="icon-sm" />
            </button>

            <div className="historico-card-image route-image">
              <img src={primeiraImagem} alt={roteiro.titulo || "Roteiro"} />

              <div className="historico-route-overlay"></div>

              <svg
                className="historico-route-line"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  d="M20,80 Q40,40 60,70 T80,20"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                <circle
                  cx="20"
                  cy="80"
                  r="4"
                  fill="#a3153b"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="80"
                  cy="20"
                  r="4"
                  fill="#a3153b"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="historico-card-body">
              <h3>{roteiro.titulo || "Roteiro criado"}</h3>

              <p className="historico-route-description">
                {roteiro.descricao || "Roteiro turístico criado por você."}
              </p>

              <div className="historico-tags">
                <span className="tag gray-dark">
                  <MapPin className="icon-xs" />
                  {roteiro.pontos?.length || 0} Paradas
                </span>

                <span className="tag gray-dark">
                  <Clock className="icon-xs" />
                  {roteiro.status || "RASCUNHO"}
                </span>

                <span className="tag green">
                  {formatarMoeda(
                    roteiro.orcamento || calcularTotalIngressos(roteiro)
                  )}
                </span>
              </div>

              <div className="historico-card-footer">
                <button
                  type="button"
                  className="historico-details-button"
                  onClick={() => setRoteiroSelecionado(roteiro)}
                >
                  Ver Detalhes do Roteiro
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {roteiroSelecionado && (
        <div
          className="roteiro-modal-overlay"
          onClick={() => setRoteiroSelecionado(null)}
        >
          <div
            className="roteiro-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="roteiro-modal-close"
              onClick={() => setRoteiroSelecionado(null)}
            >
              <X size={22} />
            </button>

            <div className="roteiro-modal-header">
              <h2>{roteiroSelecionado.titulo}</h2>

              <span>{roteiroSelecionado.status || "RASCUNHO"}</span>
            </div>

            <p className="roteiro-modal-description">
              {roteiroSelecionado.descricao ||
                "Roteiro turístico criado por você."}
            </p>

            <div className="roteiro-modal-info-grid">
              <div>
                <strong>Data de início</strong>
                <p>{formatarData(roteiroSelecionado.dataInicio)}</p>
              </div>

              <div>
                <strong>Data de término</strong>
                <p>{formatarData(roteiroSelecionado.dataFim)}</p>
              </div>

              <div>
                <strong>Pessoas</strong>
                <p>{roteiroSelecionado.quantidadePessoas}</p>
              </div>

              <div>
                <strong>Orçamento</strong>
                <p>{formatarMoeda(roteiroSelecionado.orcamento)}</p>
              </div>

              <div>
                <strong>Total dos ingressos</strong>
                <p>{formatarMoeda(calcularTotalIngressos(roteiroSelecionado))}</p>
              </div>

              <div>
                <strong>Total de paradas</strong>
                <p>{roteiroSelecionado.pontos?.length || 0}</p>
              </div>
            </div>

            <div className="roteiro-modal-pontos">
              <h3>Pontos do roteiro</h3>

              {!roteiroSelecionado.pontos ||
              roteiroSelecionado.pontos.length === 0 ? (
                <p>Nenhum ponto neste roteiro.</p>
              ) : (
                roteiroSelecionado.pontos.map((item) => (
                  <div className="roteiro-modal-ponto" key={item.id}>
                    <span>{item.ordemVisita}</span>

                    <img
                      src={
                        item.pontoTuristico?.imagemUrl ||
                        "https://images.unsplash.com/photo-1548115184-bfa201b1a7ab?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={item.pontoTuristico?.nome || "Ponto turístico"}
                    />

                    <div>
                      <strong>
                        {item.pontoTuristico?.nome || "Ponto turístico"}
                      </strong>

                      <p>
                        {item.pontoTuristico?.cidade || "Cidade"}{" "}
                        {item.pontoTuristico?.estado
                          ? `- ${item.pontoTuristico.estado}`
                          : ""}
                      </p>

                      <small>
                        Ingresso:{" "}
                        {formatarMoeda(
                          item.pontoTuristico?.valorIngresso || 0
                        )}
                      </small>

                      <small>
                        ♿{" "}
                        {item.pontoTuristico?.acessivel
                          ? "Acessível"
                          : "Não acessível"}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="roteiro-modal-actions">
              <button
                type="button"
                onClick={() => setRoteiroSelecionado(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HistoricoRoteiros;