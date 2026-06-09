import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import igreja from "../../templates/igreja.png";

function Navbar() {
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
        <NavLink to="/">Início</NavLink>
        <NavLink to="/pontos-turisticos">Pontos Turísticos</NavLink>
        <NavLink to="/criarRoteiro">Criar Roteiro</NavLink>
        <NavLink to="/guias">Guias</NavLink>
        <NavLink to="/promocoes">Promoções</NavLink>
        <NavLink to="/avaliacoes">Avaliações</NavLink>
      </nav>

      <Link to="/" className="header-login-btn">
        Entrar
      </Link>
    </header>
  );
}

export default Navbar;