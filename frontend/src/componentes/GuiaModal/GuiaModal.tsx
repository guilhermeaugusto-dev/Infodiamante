import { useState } from "react";

import "./GuiaModal.css";
import type { Guia } from "../../servicos/guiaService";
import { criarAgendamentoGuia } from "../../servicos/agendamentoGuiaService";

type GuiaModalProps = {
  guia: Guia | null;
  onFechar: () => void;
};

function GuiaModal({ guia, onFechar }: GuiaModalProps) {
  const [mostrarAgendamento, setMostrarAgendamento] = useState(false);
  const [data, setData] = useState("");
  const [horas, setHoras] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  if (!guia) return null;

  const imagem =
    guia.imagemUrl ||
    guia.usuario?.fotoUrl ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80";

  async function agendarGuia() {
    if (!data || !horas) {
      setMensagem("Informe a data e a quantidade de horas.");
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");

      await criarAgendamentoGuia({
        guiaId: guia?.id || 0,
        data,
        horas,
        observacoes,
      });

      setMensagem(
  "Agendamento solicitado com sucesso! O guia irá analisar e confirmar sua solicitação."
)

      setData("");
      setHoras("");
      setObservacoes("");
    } catch (error) {
      console.log("Erro ao agendar guia:", error);
      setMensagem(
        error instanceof Error ? error.message : "Erro ao agendar guia."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="guia-modal-overlay" onClick={onFechar}>
      <div className="guia-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="guia-modal-close" onClick={onFechar}>
          ×
        </button>

        <div className="guia-modal-image">
          <img src={imagem} alt={guia.usuario?.nome || "Guia turístico"} />

          {guia.verificado && (
            <span className="guia-modal-badge">✓ Guia verificado</span>
          )}
        </div>

        <div className="guia-modal-content">
          <h2>{guia.usuario?.nome || "Guia turístico"}</h2>

          <strong className="guia-modal-specialty">
            {guia.especialidade}
          </strong>

          <div className="guia-modal-info">
            <span>📍 {guia.usuario?.cidade || "Cidade não informada"}</span>
            <span>🗣️ {guia.idiomas || "Idiomas não informados"}</span>

            <span>
              💼{" "}
              {guia.anosExperiencia
                ? `${guia.anosExperiencia} anos de experiência`
                : "Experiência não informada"}
            </span>

            <span>
              💰{" "}
              {guia.precoPorHora
                ? `R$ ${Number(guia.precoPorHora).toFixed(2)}/hora`
                : "Preço não informado"}
            </span>
          </div>

          <div className="guia-modal-section">
            <h3>Sobre o guia</h3>
            <p>{guia.biografia || "Biografia não informada."}</p>
          </div>

          <div className="guia-modal-section">
            <h3>Contato</h3>

            <p>
              <strong>Email:</strong>{" "}
              {guia.usuario?.email || "E-mail não informado"}
            </p>

            <p>
              <strong>Telefone:</strong>{" "}
              {guia.usuario?.telefone || "Telefone não informado"}
            </p>
          </div>

          <div className="guia-modal-section">
            <h3>Roteiros do usuário</h3>

            {guia.usuario?.roteiros && guia.usuario.roteiros.length > 0 ? (
              <div className="guia-modal-roteiros">
                {guia.usuario.roteiros.map((roteiro: any) => (
                  <div className="guia-modal-roteiro" key={roteiro.id}>
                    <strong>{roteiro.nome || "Roteiro sem nome"}</strong>
                    <p>{roteiro.descricao || "Sem descrição."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Este guia ainda não possui roteiros cadastrados.</p>
            )}
          </div>

          {mostrarAgendamento && (
            <div className="guia-modal-section guia-agendamento-box">
              <h3>Agendar com este guia</h3>

              <div className="guia-agendamento-grid">
                <div className="guia-agendamento-group">
                  <label>Data</label>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>

                <div className="guia-agendamento-group">
                  <label>Quantidade de horas</label>
                  <input
                    type="number"
                    min="1"
                    value={horas}
                    onChange={(e) => setHoras(e.target.value)}
                    placeholder="Ex: 2"
                  />
                </div>

                <div className="guia-agendamento-group full">
                  <label>Observações</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex: Gostaria de conhecer pontos históricos no centro..."
                  />
                </div>
              </div>

              {mensagem && (
                <p
                  className={
                    mensagem.includes("sucesso")
                      ? "guia-agendamento-msg sucesso"
                      : "guia-agendamento-msg erro"
                  }
                >
                  {mensagem}
                </p>
              )}

              <button
                type="button"
                className="guia-modal-primary"
                onClick={agendarGuia}
                disabled={carregando}
              >
                {carregando ? "Agendando..." : "Confirmar agendamento"}
              </button>
            </div>
          )}

          <div className="guia-modal-actions">
            <button
              type="button"
              className="guia-modal-primary"
              onClick={() => setMostrarAgendamento(!mostrarAgendamento)}
            >
              {mostrarAgendamento ? "Fechar agendamento" : "Agendar guia"}
            </button>

            <button type="button" className="guia-modal-secondary">
              Ver roteiros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuiaModal;