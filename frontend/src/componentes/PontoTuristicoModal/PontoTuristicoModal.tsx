import "./PontoTuristicoModal.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  alternarFavorito,
  verificarFavorito,
} from "../../servicos/favoritoService";

type PontoTuristico = {
  id: number;
  nome: string;
  descricao: string;
  endereco?: string | null;
  cidade: string;
  estado: string;
  imagemUrl?: string | null;

  valorIngresso?: string | number | null;
  acessivel?: boolean;
  tipoAcessibilidade?: string | null;
  observacoesAcessibilidade?: string | null;
  horarioAbertura?: string | null;
  horarioFechamento?: string | null;

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
  const [favoritado, setFavoritado] = useState(false);
  const [carregandoFavorito, setCarregandoFavorito] = useState(false);
  const [mensagemFavorito, setMensagemFavorito] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarFavorito() {
      if (!ponto) return;

      try {
        const estaFavoritado = await verificarFavorito(ponto.id);
        setFavoritado(estaFavoritado);
      } catch (error) {
        console.log("Erro ao verificar favorito:", error);
      }
    }

    carregarFavorito();
  }, [ponto]);

  if (!ponto) return null;

  function calcularNota() {
    const avaliacoes = ponto.avaliacoes || [];

    if (avaliacoes.length === 0) {
      return "0.0";
    }

    const soma = avaliacoes.reduce((total, avaliacao) => {
      return total + Number(avaliacao.nota || 0);
    }, 0);

    return (soma / avaliacoes.length).toFixed(1);
  }

  function formatarMoeda(valor?: string | number | null) {
    if (valor === null || valor === undefined || valor === "") {
      return "Gratuito ou não informado";
    }

    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarHorario() {
    if (ponto.horarioAbertura && ponto.horarioFechamento) {
      return `${ponto.horarioAbertura} às ${ponto.horarioFechamento}`;
    }

    if (ponto.horarioAbertura && !ponto.horarioFechamento) {
      return `Abre às ${ponto.horarioAbertura}`;
    }

    if (!ponto.horarioAbertura && ponto.horarioFechamento) {
      return `Fecha às ${ponto.horarioFechamento}`;
    }

    return "Horário não informado";
  }

  async function handleFavorito() {
    if (!ponto) return;

    try {
      setCarregandoFavorito(true);
      setMensagemFavorito("");

      const data = await alternarFavorito(ponto.id);

      setFavoritado(data.favoritado);
      setMensagemFavorito(data.mensagem);
    } catch (error) {
      console.log("Erro ao favoritar:", error);

      setMensagemFavorito(
        error instanceof Error ? error.message : "Erro ao favoritar."
      );
    } finally {
      setCarregandoFavorito(false);
    }
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
            <span>💰 {formatarMoeda(ponto.valorIngresso)}</span>
            <span>🕒 {formatarHorario()}</span>
            <span>
              ♿ {ponto.acessivel ? "Acessível" : "Não acessível"}
            </span>
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
              <strong>Valor do ingresso</strong>
              <p>{formatarMoeda(ponto.valorIngresso)}</p>
            </div>

            <div>
              <strong>Horário de funcionamento</strong>
              <p>{formatarHorario()}</p>
            </div>

            <div>
              <strong>Acessibilidade</strong>
              <p>
                {ponto.acessivel
                  ? "Sim, este ponto possui acessibilidade."
                  : "Não, este ponto não é acessível."}
              </p>
            </div>

            {ponto.acessivel && (
              <>
                <div>
                  <strong>Tipo de acessibilidade</strong>
                  <p>{ponto.tipoAcessibilidade}</p>
                </div>

                <div>
                  <strong>Observações de acessibilidade</strong>
                  <p>
                    {ponto.observacoesAcessibilidade ||
                      "Nenhuma observação informada."}
                  </p>
                </div>
              </>
            )}

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
            <button
              type="button"
              className={`ponto-modal-favorite ${
                favoritado ? "favoritado" : ""
              }`}
              onClick={handleFavorito}
              disabled={carregandoFavorito}
            >
              {carregandoFavorito
                ? "Salvando..."
                : favoritado
                ? "♥ Remover dos favoritos"
                : "♡ Adicionar aos favoritos"}
            </button>

           <button
  type="button"
  className="ponto-modal-route"
  onClick={() => {
    onFechar();
    navigate(`/avaliar-ponto/${ponto.id}`);
  }}
>
  Avaliar
</button>

            {mensagemFavorito && (
              <p className="ponto-modal-favorite-message">
                {mensagemFavorito}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PontoTuristicoModal;