import { useState } from "react";
import "./Login.css";
import { google, facebook, usuario, tranca, olho, olhoSemTranca } from "../../assets";
import Footer from "../../componentes/Footer/footer";
import Navbar from "../../componentes/Navbar/navbar";
import { Link } from "react-router-dom";
import { cadastrarUsuario } from "../../servicos/login-cadastro";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(""); 
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState(""); 

async function handleCadastro(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (senha !== confirmarSenha) {
    alert("As senhas não conferem");
    return;
  }

  try {
    const data = await cadastrarUsuario(nome, email, senha, confirmarSenha);

    console.log("Usuário cadastrado:", data);
    alert("Conta criada com sucesso!");
    window.location.href = "/pontos-turisticos";
  } catch (error) {
    if (error instanceof Error) {
      console.log("Erro ao cadastrar usuário:", error.message);
      alert(error.message);
    } else {
      console.log("Erro desconhecido:", error);
      alert("Erro ao criar conta");
    }
  }
}

  return (
    <div className="login-page">
      <Navbar />

      <main className="login-container">
        <section className="welcome-area">
          <div className="welcome-content">
            <h2>
              Junte-se a nós
              <br />
              e descubra
            </h2>

            <p>
              Crie sua conta para salvar roteiros, avaliar lugares e contratar
              guias locais.
            </p>

            <div className="feature-card">
              <div className="feature-icon wine">
                <img src={usuario} alt="Perfil" />
              </div>
              <div>
                <strong>Perfil personalizado</strong>
                <span>Salve seus locais favoritos.</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon yellow">
                <img src={google} alt="Google" />
              </div>
              <div>
                <strong>Entrar com redes</strong>
                <span>Use Google ou Facebook para acelerar.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="form-area">
          <div className="login-icon">
            <img src={usuario} alt="Usuário" />
          </div>

          <h2>Crie sua conta</h2>

         <form onSubmit={handleCadastro }>
            <div className="form-group">
              <label htmlFor="name">Nome completo</label>
              <div className="input-wrapper">
                <span>
                  <img src={usuario} alt="Usuário" />
                </span>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="Seu nome completo" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <div className="input-wrapper">
                <span>
                  <img src={usuario} alt="E-mail" />
                </span>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Seu melhor e-mail" 
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
                  placeholder="Crie uma senha"
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

            <div className="form-group">
              <label htmlFor="confirm">Confirmar senha</label>
              <div className="input-wrapper">
                <span>
                  <img src={tranca} alt="Tranca" />
                </span>

                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirm"
                  placeholder="Repita a senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-pressed={showConfirm}
                  aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                >
                  <img
                    src={showConfirm ? olhoSemTranca : olho}
                    alt={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                  />
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Criar conta
            </button>

            <div className="divider">
              <span></span>
              <p>ou cadastre-se com</p>
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
              Já tem uma conta? <Link to="/">Entrar</Link>
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}


export default Signup;