import { Calendar } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

function HistoricoAgendamentos() {
  const { usuario } = useUser();

  const agendamentos = usuario?.agendamentos || [];


  function formatarData(data?: string) {
    if (!data) return "Sem data";
    return new Date(data).toLocaleDateString("pt-BR");
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
      {agendamentos.map((agendamento: any, index: number) => (
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
              src={
                agendamento.guia?.usuario?.fotoUrl ||
                agendamento.guia?.fotoUrl ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
              }
              alt="Guia"
            />
          </div>

          <div className="historico-card-body">
            <h3>
              {agendamento.guia?.usuario?.nome ||
                agendamento.guia?.nome ||
                "Guia local"}
            </h3>

            <div className="historico-tags">
              <span className="tag green">Guia</span>
              <span className="tag gray">{agendamento.status || "Pendente"}</span>
            </div>

            <p className="historico-route-description">
              {agendamento.descricao ||
                agendamento.guia?.descricao ||
                "Agendamento com guia turístico local."}
            </p>

            <div className="historico-card-footer">
              <div className="historico-location">
                <Calendar className="icon-xs wine-icon" />
                {formatarData(agendamento.data)}
              </div>

              <div className="historico-rating">
                <span>{agendamento.horario || ""}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default HistoricoAgendamentos;