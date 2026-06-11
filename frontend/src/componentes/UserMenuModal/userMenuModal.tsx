import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserMenuModal.css";

function UserMenuModal() {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);

  const nomeUsuario = localStorage.getItem("nome");
  console.log(localStorage.getItem("nome"));
  const primeiroNome = nomeUsuario ? nomeUsuario.split(" ")[0] : "Usuário";
  const fotoUrl = localStorage.getItem("fotoUrl");
  const inicial = primeiroNome.charAt(0).toUpperCase();


  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("email");

    setAberto(false);
    navigate("/");
  }

  return (
    <div className="user-menu">
      <button
      type="button"
      className="user-menu-button"
      onClick={() => setAberto(!aberto)}
    >
      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt="Foto do usuário"
          className="user-menu-photo"
        />
      ) : (
        <span className="user-menu-initial">{inicial}</span>
      )}
    </button>
      {aberto && (
        <div className="user-modal">
          <div className="user-modal-header">
            <span className="user-modal-icon">👤</span>
            <div>
              <strong>{primeiroNome}</strong>
              <p>Minha conta</p>
            </div>
          </div>

          <button
            type="button"
            className="user-modal-option"
            onClick={() => {
              setAberto(false);
              navigate("/configuracoes");
            }}
          >
            Configurações
          </button>

          <button
            type="button"
            className="user-modal-option sair"
            onClick={sair}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenuModal;