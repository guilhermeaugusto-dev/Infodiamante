import { useState } from "react";
import "./Login.css";
import { useUser } from "../../contexts/UserContext";

import {
  google,
  facebook,
  usuario,
  tranca,
  olho,
  olhoSemTranca,
  guia,
  mapa,
  carrinho,
} from "../../assets";

import Footer from "../../componentes/Footer/footer";
import Navbar from "../../componentes/Navbar/navbar";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../../servicos/login-cadastroService";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUsuario, salvarUsuario } = useUser();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = await loginUsuario(email, senha);
      localStorage.setItem("token", data.token);
      salvarUsuario(data.usuario);
      setUsuario(data.usuario);
      navigate("/pontos-turisticos");
    
      console.log("Login realizado com sucesso:", data);
    } catch (error) {
      console.log("Erro ao fazer login:", error);

    }
  }
console.log("Token salvo:", localStorage.getItem("token"));
  return (
    <div className="login-page">
      <Navbar />

      <main className="login-container">
        <section className="welcome-area">
          <div className="route-line"></div>

          <div className="welcome-content">
            <h2>
              Bem-vindo
              <br />
              de volta
            </h2>

            <p>
              Acesse sua conta para criar roteiros personalizados, contratar
              guias e descobrir lugares incríveis.
            </p>

            <div className="feature-card">
              <div className="feature-icon wine">
                <img src={mapa} alt="Roteiro" />
              </div>
              <div>
                <strong>Roteiros personalizados</strong>
                <span>Monte itinerários do seu jeito.</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon yellow">
                <img src={guia} alt="Guia" />
              </div>
              <div>
                <strong>Guias de Turismo</strong>
                <span>Encontre guias locais qualificados.</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">
                <img src={carrinho} alt="Promoções" />
              </div>
              <div>
                <strong>Promoções exclusivas</strong>
                <span>Descontos e vantagens para você.</span>
              </div>
            </div>

            <div className="security-card">
              <div className="security-icon">🛡️</div>

              <div>
                <strong>Seus dados estão seguros</strong>
                <span>
                  Utilizamos criptografia e seguimos as melhores práticas de
                  privacidade para proteger você.
                </span>
              </div>

              <div className="lock-icon">🔒</div>
            </div>
          </div>
        </section>

        <section className="form-area">
          <div className="login-icon">
            <img src={usuario} alt="Usuário" />
          </div>

          <h2>Entrar na sua conta</h2>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>

              <div className="input-wrapper">
                <span>
                  <img src={usuario} alt="Usuário" />
                </span>

                <input
                  type="email"
                  id="email"
                  placeholder="E-mail ou nome de usuário"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>

              <div className="input-wrapper">
                <span>
                  <img src={tranca} alt="Tranca" />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <img
                    src={showPassword ? olhoSemTranca : olho}
                    alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  />
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" defaultChecked />
                Lembrar de mim
              </label>

              <a href="#">Esqueci minha senha</a>
            </div>

      <button type="submit" className="submit-btn"> 
                  <span>➜</span>
                Entrar
              </button>

            <div className="divider">
              <span></span>
              <p>ou continue com</p>
              <span></span>
            </div>

            <div className="social-buttons">
              <button type="button">
                <span className="google">
                  <img src={google} alt="Google" />
                </span>
                Continuar com Google
              </button>

              <button type="button">
                <span className="facebook">
                  <img src={facebook} alt="Facebook" />
                </span>
                Continuar com Facebook
              </button>
            </div>

            <p className="signup-text">
              Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
            </p>
          </form>
        </section>
      </main>


      <Footer />
    </div>
  );
}

export default Login;