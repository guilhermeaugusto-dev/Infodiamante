import { Heart, MapPin, Share2 } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

function HistoricoFavoritos() {
  const { usuario } = useUser();

  const favoritos = usuario?.favoritos || [];

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
      {favoritos.map((favorito: any, index: number) => (
        <div
          className="historico-card"
          key={`favorito-${favorito.id || index}`}
        >
          <div className="historico-date">
            <Heart className="icon-xs wine-icon" />
            Favorito
          </div>

          <button type="button" className="historico-share-button">
            <Share2 className="icon-sm" />
          </button>

          <div className="historico-card-image">
            <img
              src={
                favorito.pontoTuristico?.imagemUrl ||
                favorito.pontoTuristico?.fotoUrl ||
                favorito.imagemUrl ||
                "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80"
              }
              alt="Favorito"
            />
          </div>

          <div className="historico-card-body">
            <h3>{favorito.pontoTuristico?.nome || "Item favoritado"}</h3>

            <div className="historico-tags">
              <span className="tag pink">Favorito</span>
              <span className="tag gray">Salvo</span>
            </div>

            <p className="historico-route-description">
              {favorito.pontoTuristico?.descricao ||
                "Local salvo nos seus favoritos."}
            </p>

            <div className="historico-card-footer">
              <div className="historico-location">
                <MapPin className="icon-xs wine-icon fill" />
                {favorito.pontoTuristico?.cidade ||
                  favorito.pontoTuristico?.localizacao ||
                  "Local"}
              </div>

              <div className="historico-rating favorito">
                <Heart className="icon-xs fill" />
                <span>Favoritado</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default HistoricoFavoritos;