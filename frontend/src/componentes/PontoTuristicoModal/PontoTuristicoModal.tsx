import "./PontoTuristicoModal.css";

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

type PontoTuristicoModalProps = {
  ponto: PontoTuristico | null;
  onFechar: () => void;
};

function PontoTuristicoModal({ ponto, onFechar }: PontoTuristicoModalProps) {
  if (!ponto) return null;

  function calcularNota() {
    const avaliacoes = ponto?.avaliacoes || [];

    if (avaliacoes.length === 0) {
      return "0.0";
    }

    const soma = avaliacoes.reduce((total, avaliacao) => {
      return total + Number(avaliacao.nota || 0);
    }, 0);

    return (soma / avaliacoes.length).toFixed(1);
  }

  return (
    <div className="ponto-modal-overlay" onClick={onFechar}>
      <div className="ponto-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="ponto-modal-close"
          onClick={onFechar}
        >
          ×
        </button>

        <div className="ponto-modal-image">
          <img
            src={
              ponto.imagemUrl ||
              "https://images.unsplash.com/photo-1548115184-bfa201b1a7ab?auto=format&fit=crop&w=900&q=80"
            }
            alt={ponto.nome}
          />

          <span className="ponto-modal-category">
            {ponto.categoria?.nome || "Turismo"}
          </span>
        </div>

        <div className="ponto-modal-content">
          <h2>{ponto.nome}</h2>

          <div className="ponto-modal-info">
            <span>📍 {ponto.regiao?.nome || ponto.cidade}</span>
            <span>⭐ {calcularNota()}</span>
            <span>💬 {ponto.avaliacoes?.length || 0} avaliações</span>
          </div>

          <p className="ponto-modal-description">{ponto.descricao}</p>

          <div className="ponto-modal-details">
            <div>
              <strong>Endereço</strong>
              <p>{ponto.endereco || "Endereço não informado"}</p>
            </div>

            <div>
              <strong>Cidade</strong>
              <p>
                {ponto.cidade} - {ponto.estado}
              </p>
            </div>

            <div>
              <strong>Categoria</strong>
              <p>{ponto.categoria?.nome || "Sem categoria"}</p>
            </div>

            <div>
              <strong>Região</strong>
              <p>{ponto.regiao?.nome || "Sem região"}</p>
            </div>
          </div>

          <div className="ponto-modal-actions">
            <button type="button" className="ponto-modal-favorite">
              ♡ Adicionar aos favoritos
            </button>

            <button type="button" className="ponto-modal-route">
              + Adicionar ao roteiro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PontoTuristicoModal;