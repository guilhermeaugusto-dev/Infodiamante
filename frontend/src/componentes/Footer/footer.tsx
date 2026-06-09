import igreja from "../../templates/igreja.png";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <div className="footer-logo">
          <div className="logo-icon"><img src={igreja} alt="Igreja" /></div>
          <div>
            <h3>DESCUBRA</h3>
            <p>MINHA CIDADE</p>
          </div>
        </div>

        <p>
          Sua plataforma completa para explorar, viver e se apaixonar por cada
          canto do Brasil.
        </p>
      </div>

      <div>
        <h4>Institucional</h4>
        <a href="#">Sobre nós</a>
        <a href="#">Como funciona</a>
        <a href="#">Termos de uso</a>
        <a href="#">Política de privacidade</a>
      </div>

      <div>
        <h4>Ajuda</h4>
        <a href="#">Central de ajuda</a>
        <a href="#">Dúvidas frequentes</a>
        <a href="#">Fale conosco</a>
        <a href="#">Suporte</a>
      </div>

      <div>
        <h4>Contato</h4>
        <p>📞 (31) 99999-9999</p>
        <p>✉️ contato@descubraminhacidade.com.br</p>
        <p>📍 Belo Horizonte - MG, Brasil</p>
      </div>

      <div>
        <h4>Siga-nos</h4>

        <div className="social-icons">
          <span>◎</span>
          <span>f</span>
          <span>▶</span>
          <span>♪</span>
        </div>

        <h4 className="newsletter-title">Receba dicas e promoções</h4>

        <div className="newsletter">
          <input type="email" placeholder="Seu melhor e-mail" />
          <button>➤</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
