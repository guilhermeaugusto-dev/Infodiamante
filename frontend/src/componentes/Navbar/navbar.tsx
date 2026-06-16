
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import igreja from "../../templates/igreja.png";
import UserMenuModal from "../UserMenuModal/userMenuModal";
import { useUser } from "../../contexts/UserContext";

function Navbar() {


  const token = localStorage.getItem("token");
  const { usuario } = useUser();
  const isAdmin = usuario?.tipo === "ADMIN";
  const usuarioLogado = !!token;

  return (
    
    <header className="navbar">
      <Link to="/" className="logo">
        <div className="logo-icon">
          <img src={igreja} alt="Igreja" />
        </div>

        <div>
          <h1>DESCUBRA</h1>
          <span>MINHA CIDADE</span>
          <p>Explore. Viva. Lembre-se.</p>
        </div>
      </Link>

      <nav className="menu">
        {!usuarioLogado && <NavLink to="/">Início</NavLink>}
        

        <NavLink to="/pontos-turisticos">Pontos Turísticos</NavLink>
        <NavLink to="/criarRoteiro">Criar Roteiro</NavLink>
        <NavLink to="/guias">Guias</NavLink>
        <NavLink to="/seja-parceiro">Seja Parceiro</NavLink>
        <NavLink to="/seja-guia">Seja um Guia</NavLink>
        <NavLink to="/avaliacoes">Avaliações</NavLink>

      </nav>

      {!usuarioLogado ? (
        <Link to="/" className="header-login-btn">
          Entrar
        </Link>
      ) : (
        <UserMenuModal />
      )}
    </header>
  );
}

export default Navbar;