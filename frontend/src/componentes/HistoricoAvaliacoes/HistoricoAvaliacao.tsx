import { Calendar, MapPin, Share2, Star } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

function HistoricoAvaliacoes() {
  const { usuario } = useUser();

  const avaliacoes = usuario?.avaliacoes || [];

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
      {avaliacoes.map((avaliacao: any, index: number) => (
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
                avaliacao.pontoTuristico?.fotoUrl ||
                avaliacao.imagemUrl ||
                "https://images.unsplash.com/photo-1548115184-bfa201b1a7ab?auto=format&fit=crop&w=600&q=80"
              }
              alt="Local avaliado"
            />
            <div className="historico-image-overlay"></div>
          </div>

          <div className="historico-card-body">
            <h3>{avaliacao.pontoTuristico?.nome || "Local avaliado"}</h3>

            <div className="historico-tags">
              <span className="tag pink">Avaliação</span>
              <span className="tag gray">Nota {avaliacao.nota || "-"}</span>
            </div>

            <p className="historico-route-description">
              {avaliacao.comentario || "Sem comentário informado."}
            </p>

            <div className="historico-card-footer">
              <div className="historico-location">
                <MapPin className="icon-xs wine-icon fill" />
                {avaliacao.pontoTuristico?.cidade ||
                  avaliacao.pontoTuristico?.localizacao ||
                  "Local"}
              </div>

              <div className="historico-rating">
                <span>Sua nota:</span>
                <div className="stars">{renderizarEstrelas(avaliacao.nota)}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default HistoricoAvaliacoes;