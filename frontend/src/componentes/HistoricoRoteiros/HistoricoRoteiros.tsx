import { Calendar, Clock, MapPin } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

function HistoricoRoteiros() {
  const { usuario } = useUser();

  const roteiros = usuario?.roteiros || [];

  function formatarData(data?: string) {
    if (!data) return "Roteiro";
    return new Date(data).toLocaleDateString("pt-BR");
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
      {roteiros.map((roteiro: any, index: number) => (
        <div className="historico-card roteiro" key={`roteiro-${roteiro.id || index}`}>
          <div className="historico-date">
            <Calendar className="icon-xs wine-icon" />
            {formatarData(roteiro.criadoEm)}
          </div>

          <div className="historico-route-badge">Roteiro</div>

          <div className="historico-card-image route-image">
            <img
              src={
                roteiro.imagemUrl ||
                roteiro.fotoUrl ||
                "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
              }
              alt={roteiro.nome || roteiro.titulo || "Roteiro"}
            />

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
            <h3>{roteiro.nome || roteiro.titulo || "Roteiro criado"}</h3>

            <p className="historico-route-description">
              {roteiro.descricao || "Roteiro turístico criado por você."}
            </p>

            <div className="historico-tags">
              <span className="tag gray-dark">
                <MapPin className="icon-xs" />
                {roteiro.pontos?.length || roteiro.paradas?.length || 0} Paradas
              </span>

              <span className="tag gray-dark">
                <Clock className="icon-xs" />
                {roteiro.duracao || "Sem duração"}
              </span>
            </div>

            <div className="historico-card-footer">
              <button
                type="button"
                className="historico-details-button"
                onClick={() => console.log("Ver roteiro:", roteiro.id)}
              >
                Ver Detalhes do Roteiro
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default HistoricoRoteiros;