import { useEffect, useState } from "react";
import { Calendar, MapPin, Share2, Star, Pencil, Trash2, Save, X } from "lucide-react";

import {
  listarMinhasAvaliacoes,
  atualizarAvaliacao,
  deletarAvaliacao,
  type Avaliacao,
} from "../../servicos/avaliacaoService";

function HistoricoAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [notaEditada, setNotaEditada] = useState(5);
  const [comentarioEditado, setComentarioEditado] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const data = await listarMinhasAvaliacoes();
        setAvaliacoes(data);
      } catch (error) {
        console.log("Erro ao carregar histórico de avaliações:", error);
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar histórico de avaliações."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarHistorico();
  }, []);

  function formatarData(data?: string) {
    if (!data) return "Sem data";
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function renderizarEstrelas(nota?: number) {
    const notaNumero = Number(nota || 0);

    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={index < notaNumero ? "icon-xs fill" : "icon-xs"}
      />
    ));
  }

  function iniciarEdicao(avaliacao: Avaliacao) {
    setEditandoId(avaliacao.id);
    setNotaEditada(avaliacao.nota);
    setComentarioEditado(avaliacao.comentario);
    setMensagem("");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNotaEditada(5);
    setComentarioEditado("");
    setMensagem("");
  }

  async function salvarEdicao(id: number) {
    if (!comentarioEditado.trim()) {
      setMensagem("O comentário não pode ficar vazio.");
      return;
    }

    try {
      setSalvando(true);
      setMensagem("");

      const data = await atualizarAvaliacao(id, {
        nota: notaEditada,
        comentario: comentarioEditado,
      });

      const avaliacaoAtualizada = data.avaliacao || data;

      setAvaliacoes((lista) =>
        lista.map((avaliacao) =>
          avaliacao.id === id
            ? {
                ...avaliacao,
                nota: avaliacaoAtualizada.nota ?? notaEditada,
                comentario: avaliacaoAtualizada.comentario ?? comentarioEditado,
                atualizadoEm:
                  avaliacaoAtualizada.atualizadoEm || avaliacao.atualizadoEm,
              }
            : avaliacao
        )
      );

      setMensagem("Avaliação atualizada com sucesso!");
      cancelarEdicao();
    } catch (error) {
      console.log("Erro ao editar avaliação:", error);
      setMensagem(
        error instanceof Error ? error.message : "Erro ao editar avaliação."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function removerAvaliacao(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta avaliação?"
    );

    if (!confirmar) return;

    try {
      setMensagem("");

      await deletarAvaliacao(id);

      setAvaliacoes((lista) =>
        lista.filter((avaliacao) => avaliacao.id !== id)
      );

      setMensagem("Avaliação excluída com sucesso!");
    } catch (error) {
      console.log("Erro ao excluir avaliação:", error);
      setMensagem(
        error instanceof Error ? error.message : "Erro ao excluir avaliação."
      );
    }
  }

  if (carregando) {
    return (
      <div className="historico-empty">
        <h2>Carregando suas avaliações...</h2>
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

  if (avaliacoes.length === 0) {
    return (
      <div className="historico-empty">
        <h2>Você ainda não fez avaliações</h2>
        <p>Quando você avaliar algum ponto turístico, ele aparecerá aqui.</p>
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

      {avaliacoes.map((avaliacao, index) => (
        <div
          className="historico-card"
          key={`avaliacao-${avaliacao.id || index}`}
        >
          <div className="historico-date">
            <Calendar className="icon-xs wine-icon" />
            {formatarData(avaliacao.criadoEm)}
          </div>

          <button type="button" className="historico-share-button">
            <Share2 className="icon-sm" />
          </button>

          <div className="historico-card-image">
            <img
              src={
                avaliacao.pontoTuristico?.imagemUrl ||
                "https://images.unsplash.com/photo-1548115184-bfa201b1a7ab?auto=format&fit=crop&w=600&q=80"
              }
              alt={avaliacao.pontoTuristico?.nome || "Local avaliado"}
            />

            <div className="historico-image-overlay"></div>
          </div>

          <div className="historico-card-body">
            <h3>{avaliacao.pontoTuristico?.nome || "Local avaliado"}</h3>

            <div className="historico-tags">
              <span className="tag pink">Avaliação</span>
              <span className="tag gray">Nota {avaliacao.nota || "-"}</span>

              {avaliacao.pontoTuristico?.categoria?.nome && (
                <span className="tag gray">
                  {avaliacao.pontoTuristico.categoria.nome}
                </span>
              )}
            </div>

            {editandoId === avaliacao.id ? (
              <div className="historico-edit-box">
                <label>Nota</label>

                <select
                  value={notaEditada}
                  onChange={(e) => setNotaEditada(Number(e.target.value))}
                >
                  <option value={5}>5 - Excelente</option>
                  <option value={4}>4 - Muito bom</option>
                  <option value={3}>3 - Bom</option>
                  <option value={2}>2 - Regular</option>
                  <option value={1}>1 - Ruim</option>
                </select>

                <label>Comentário</label>

                <textarea
                  value={comentarioEditado}
                  onChange={(e) => setComentarioEditado(e.target.value)}
                  placeholder="Edite seu comentário..."
                />

                <div className="historico-edit-actions">
                  <button
                    type="button"
                    className="historico-save-button"
                    onClick={() => salvarEdicao(avaliacao.id)}
                    disabled={salvando}
                  >
                    <Save className="icon-xs" />
                    {salvando ? "Salvando..." : "Salvar"}
                  </button>

                  <button
                    type="button"
                    className="historico-cancel-button"
                    onClick={cancelarEdicao}
                  >
                    <X className="icon-xs" />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="historico-route-description">
                {avaliacao.comentario || "Sem comentário informado."}
              </p>
            )}

            <div className="historico-card-footer">
              <div className="historico-location">
                <MapPin className="icon-xs wine-icon fill" />
                {avaliacao.pontoTuristico?.cidade || "Local"}
                {avaliacao.pontoTuristico?.estado
                  ? ` - ${avaliacao.pontoTuristico.estado}`
                  : ""}
              </div>

              <div className="historico-rating">
                <span>Sua nota:</span>

                <div className="stars">
                  {renderizarEstrelas(
                    editandoId === avaliacao.id ? notaEditada : avaliacao.nota
                  )}
                </div>
              </div>
            </div>

            {editandoId !== avaliacao.id && (
              <div className="historico-card-actions">
                <button
                  type="button"
                  className="historico-edit-button"
                  onClick={() => iniciarEdicao(avaliacao)}
                >
                  <Pencil className="icon-xs" />
                  Editar
                </button>

                <button
                  type="button"
                  className="historico-delete-button"
                  onClick={() => removerAvaliacao(avaliacao.id)}
                >
                  <Trash2 className="icon-xs" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default HistoricoAvaliacoes;