import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

import {
  listarMeusAgendamentosGuias,
  type AgendamentoGuia,
} from "../../servicos/agendamentoGuiaService";

function HistoricoAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoGuia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAgendamentos() {
      try {
        setCarregando(true);
        setErro("");

        const data = await listarMeusAgendamentosGuias();

        console.log("Agendamentos:", data);

        setAgendamentos(data);
      } catch (error) {
        console.log("Erro ao carregar agendamentos:", error);

        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar agendamentos."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarAgendamentos();
  }, []);

  function formatarData(data?: string) {
    if (!data) return "Sem data";
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function buscarFotoGuia(agendamento: AgendamentoGuia) {
    const fotoGuia = agendamento.guia?.usuario?.fotoUrl;

    if (fotoGuia) {
      return fotoGuia;
    }

    const nomeGuia = agendamento.guia?.usuario?.nome || "Guia Local";

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nomeGuia
    )}&background=800020&color=fff`;
  }

  function buscarNomeGuia(agendamento: AgendamentoGuia) {
    return agendamento.guia?.usuario?.nome || "Guia local";
  }

  function buscarDescricaoAgendamento(agendamento: AgendamentoGuia) {
    return (
      agendamento.observacoes ||
      agendamento.guia?.biografia ||
      agendamento.guia?.especialidade ||
      "Agendamento com guia turístico local."
    );
  }

  if (carregando) {
    return (
      <div className="historico-empty">
        <h2>Carregando agendamentos...</h2>
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

  if (agendamentos.length === 0) {
    return (
      <div className="historico-empty">
        <h2>Você ainda não possui agendamentos</h2>
        <p>Quando você agendar um guia, ele aparecerá aqui.</p>
      </div>
    );
  }

  return (
    <>
      {agendamentos.map((agendamento, index) => (
        <div
          className="historico-card"
          key={`agendamento-${agendamento.id || index}`}
        >
          <div className="historico-date">
            <Calendar className="icon-xs wine-icon" />
            {formatarData(agendamento.data)}
          </div>

          <div className="historico-route-badge">
            {agendamento.status || "Agendamento"}
          </div>

          <div className="historico-card-image">
            <img
              src={buscarFotoGuia(agendamento)}
              alt={buscarNomeGuia(agendamento)}
            />
          </div>

          <div className="historico-card-body">
            <h3>{buscarNomeGuia(agendamento)}</h3>

            <div className="historico-tags">
              <span className="tag green">Guia</span>

              <span className="tag gray">
                {agendamento.status || "Pendente"}
              </span>
            </div>

            <p className="historico-route-description">
              {buscarDescricaoAgendamento(agendamento)}
            </p>

            <div className="historico-card-footer">
              <div className="historico-location">
                <Calendar className="icon-xs wine-icon" />
                {formatarData(agendamento.data)}
              </div>

              <div className="historico-rating">
                <span>
                  {agendamento.horas ? `${agendamento.horas} hora(s)` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default HistoricoAgendamentos;