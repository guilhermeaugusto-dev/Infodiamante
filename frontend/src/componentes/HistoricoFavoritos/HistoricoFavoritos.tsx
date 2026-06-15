import { useEffect, useState } from "react";
import { Heart, MapPin, Share2, Trash2 } from "lucide-react";
import {
  listarMeusFavoritos,
  alternarFavorito,
} from "../../servicos/favoritoService";

function HistoricoFavoritos() {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [removendoId, setRemovendoId] = useState<number | null>(null);

  async function carregarFavoritos() {
    try {
      setCarregando(true);
      setErro("");

      const data = await listarMeusFavoritos();
      setFavoritos(data);
    } catch (error) {
      console.log("Erro ao carregar favoritos:", error);
      setErro("Erro ao carregar favoritos.");
    } finally {
      setCarregando(false);
    }
  }
async function compartilharFavorito(ponto: any) {
  if (!ponto) return;

  const titulo = ponto.nome || "Ponto turístico";
  const texto = ponto.descricao || "Veja este ponto turístico!";
  const url = `${window.location.origin}/pontos-turisticos?ponto=${ponto.id}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: titulo,
        text: texto,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copiado para a área de transferência!");
    }
  } catch (error) {
    console.log("Erro ao compartilhar:", error);
  }
}


  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function removerFavorito(pontoTuristicoId: number) {
    try {
      setRemovendoId(pontoTuristicoId);

      await alternarFavorito(pontoTuristicoId);

      setFavoritos((favoritosAtuais) =>
        favoritosAtuais.filter(
          (favorito) => favorito.pontoTuristico?.id !== pontoTuristicoId
        )
      );
    } catch (error) {
      console.log("Erro ao remover favorito:", error);
      alert("Erro ao remover favorito.");
    } finally {
      setRemovendoId(null);
    }
  }

  if (carregando) {
    return (
      <div className="historico-empty">
        <h2>Carregando favoritos...</h2>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="historico-empty">
        <h2>{erro}</h2>
        <p>Tente recarregar a página.</p>
      </div>
    );
  }

  if (favoritos.length === 0) {
    return (
      <div className="historico-empty">
        <h2>Você ainda não possui favoritos</h2>
        <p>Quando você favoritar algum ponto turístico, ele aparecerá aqui.</p>
      </div>
    );
  }

  return (
    <>
      {favoritos.map((favorito: any, index: number) => {
        const ponto = favorito.pontoTuristico;

        return (
          <div
            className="historico-card historico-favorito-card"
            key={`favorito-${favorito.id || index}`}
          >
            <div className="historico-date">
              <Heart className="icon-xs wine-icon" />
              Favorito
            </div>

            <div className="historico-card-actions">
              <button
  type="button"
  className="historico-share-button"
  onClick={() => compartilharFavorito(ponto)}
  title="Compartilhar"
>
  <Share2 className="icon-sm" />
</button>

              <button
                type="button"
                className="historico-remove-button"
                onClick={() => removerFavorito(ponto?.id)}
                disabled={removendoId === ponto?.id}
              >
                <Trash2 className="icon-sm" />
                {removendoId === ponto?.id ? "Removendo..." : "Remover"}
              </button>
            </div>

            <div className="historico-card-image">
              <img
                src={
                  ponto?.imagemUrl ||
                  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80"
                }
                alt={ponto?.nome || "Favorito"}
              />
            </div>

            <div className="historico-card-body">
              <h3>{ponto?.nome || "Item favoritado"}</h3>

              <div className="historico-tags">
                <span className="tag pink">Favorito</span>

                {ponto?.categoria?.nome && (
                  <span className="tag gray">{ponto.categoria.nome}</span>
                )}
              </div>

              <p className="historico-route-description">
                {ponto?.descricao || "Local salvo nos seus favoritos."}
              </p>

              <div className="historico-card-footer">
                <div className="historico-location">
                  <MapPin className="icon-xs wine-icon fill" />
                  {ponto?.cidade || "Local"}
                  {ponto?.estado ? ` - ${ponto.estado}` : ""}
                </div>

                <div className="historico-rating favorito">
                  <Heart className="icon-xs fill" />
                  <span>Favoritado</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default HistoricoFavoritos;