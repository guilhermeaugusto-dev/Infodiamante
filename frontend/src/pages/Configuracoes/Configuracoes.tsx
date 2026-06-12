import { useEffect, useState } from "react";
import {
  Camera,
  Save,
  Shield,
  Bell,
  Eye,
  Lock,
  CheckCircle,
} from "lucide-react";

import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";
import { useUser } from "../../contexts/UserContext";
import "./Configuracoes.css";
import atualizarUsuario from "../../servicos/ConfiguracaoService";

function Configuracoes() {
  const { usuario, salvarUsuario } = useUser();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [bio, setBio] = useState("");
  const [tipo, setTipo] = useState("Usuário");
  const [fotoUrl, setFotoUrl] = useState("");
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [receberNovidades, setReceberNovidades] = useState(true);
  const [perfilVisivel, setPerfilVisivel] = useState(true);
  const [mensagem, setMensagem] = useState("");

useEffect(() => {
  if (!usuario) return;

  setNome(usuario.nome || "");
  setEmail(usuario.email || "");
  setTelefone(usuario.telefone || "");
  setCidade(usuario.cidade || "");
  setBio(usuario.bio || "");
  setFotoUrl(usuario.fotoUrl || "");
  setTipo(usuario.tipo || "Usuário");
}, [usuario]);

  function carregarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    setFotoArquivo(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  async function salvarAlteracoes(e: React.FormEvent) {
  e.preventDefault();

  if (!nome.trim() || !email.trim()) {
    setMensagem("Nome e e-mail são obrigatórios.");
    return;
  }

  if (novaSenha && novaSenha.length < 8) {
    setMensagem("A nova senha precisa ter pelo menos 8 caracteres.");
    return;
  }

  if (novaSenha && novaSenha !== confirmarSenha) {
    setMensagem("As senhas não coincidem.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    setMensagem("Usuário não está logado.");
    return;
  }

  try {
    const response = await atualizarUsuario(
      nome,
      email,
      telefone,
      cidade,
      bio,
      fotoArquivo,
      novaSenha
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensagem || "Erro ao atualizar perfil.");
    }

    salvarUsuario(data.usuario);

    setNome(data.usuario.nome || "");
    setEmail(data.usuario.email || "");
    setTelefone(data.usuario.telefone || "");
    setCidade(data.usuario.cidade || "");
    setBio(data.usuario.bio || "");
    setFotoUrl(data.usuario.fotoUrl || "");
    setPreviewFoto("");
    setFotoArquivo(null);
    setNovaSenha("");
    setConfirmarSenha("");

    setMensagem("Perfil atualizado com sucesso.");
  } catch (error) {
    console.log("Erro ao atualizar perfil:", error);

    if (error instanceof Error) {
      setMensagem(error.message);
    } else {
      setMensagem("Erro ao atualizar perfil.");
    }
  }
}

  return (
    <div className="editar-page">
      <Navbar />

      <main className="editar-main">
        <section className="editar-title-area">
          <div className="editar-title-content">
            <h1>Editar Usuário</h1>
            <p>
              Atualize suas informações pessoais, foto de perfil e preferências
              da conta.
            </p>

            <div className="editar-title-line">
              <span></span>
            </div>
          </div>

          <div className="editar-decoration">
            <svg
              width="430"
              height="150"
              viewBox="0 0 430 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 120 C70 70, 120 80, 160 120"
                stroke="#800020"
                strokeWidth="2"
                fill="none"
                opacity="0.55"
              />
              <path
                d="M150 120 C210 40, 300 55, 390 120"
                stroke="#800020"
                strokeWidth="2"
                fill="none"
                opacity="0.55"
              />
              <circle cx="260" cy="42" r="24" stroke="#800020" strokeWidth="2" opacity="0.8" />
              <path d="M260 18 V66" stroke="#800020" strokeWidth="1.5" opacity="0.8" />
              <path d="M236 42 H284" stroke="#800020" strokeWidth="1.5" opacity="0.8" />
              <rect x="310" y="70" width="28" height="50" stroke="#800020" strokeWidth="2" opacity="0.7" />
              <rect x="348" y="55" width="42" height="65" stroke="#800020" strokeWidth="2" opacity="0.7" />
              <path d="M300 120 H410" stroke="#800020" strokeWidth="2" opacity="0.7" />
              <path d="M40 62 C55 48, 70 48, 83 62" stroke="#800020" strokeWidth="2" opacity="0.7" />
              <path d="M90 52 C104 39, 120 40, 132 53" stroke="#800020" strokeWidth="2" opacity="0.6" />
            </svg>
          </div>
        </section>

        <form className="editar-card" onSubmit={salvarAlteracoes}>
          <section className="editar-profile-card">
            <div className="editar-avatar">
              {previewFoto || fotoUrl ? (
                <img src={previewFoto || fotoUrl} alt="Foto do usuário" />
              ) : (
                <span>{nome ? nome.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>

            <label className="editar-foto-btn">
              <Camera size={18} />
              Alterar foto
              <input type="file" accept="image/*" onChange={carregarFoto} hidden />
            </label>

            <p>
              JPG, PNG ou WEBP.
              <br />
              Máx. 5MB.
            </p>
          </section>

          <section className="editar-form-area">
            <div className="editar-form-grid">
              <div className="editar-form-group full">
                <label>Nome completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite seu nome"
                />
              </div>

              <div className="editar-form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                />
              </div>

              <div className="editar-form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Digite seu telefone"
                />
              </div>

              <div className="editar-form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: Diamantina, MG"
                />
              </div>

              <div className="editar-form-group">
                <label>Tipo de usuário</label>
                <div className="editar-input-lock">
                  <input type="text" value={tipo} disabled />
                  <Lock size={16} />
                </div>
              </div>

              <div className="editar-form-group full">
                <label>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  maxLength={300}
                />
                <small>{bio.length}/300</small>
              </div>
            </div>

            {mensagem && (
              <div
                className={
                  mensagem.includes("sucesso")
                    ? "editar-message sucesso"
                    : "editar-message erro"
                }
              >
                <CheckCircle size={26} />
                <div>
                  <strong>{mensagem}</strong>
                  {mensagem.includes("sucesso") && (
                    <p>Suas informações foram salvas.</p>
                  )}
                </div>
              </div>
            )}
          </section>

          <aside className="editar-side-area">
            <div className="editar-side-card">
              <div className="editar-side-title">
                <div className="editar-side-icon">
                  <Shield size={22} />
                </div>

                <div>
                  <h2>Segurança</h2>
                  <div className="editar-small-line"></div>
                </div>
              </div>

              <div className="editar-form-group">
                <label>Nova senha</label>
                <div className="editar-password">
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha"
                  />
                  <Eye size={18} />
                </div>
                <small>Mínimo de 8 caracteres.</small>
              </div>

              <div className="editar-form-group">
                <label>Confirmar senha</label>
                <div className="editar-password">
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme a senha"
                  />
                  <Eye size={18} />
                </div>
              </div>
            </div>

            <div className="editar-side-card">
              <div className="editar-side-title">
                <div className="editar-side-icon">
                  <Bell size={22} />
                </div>

                <div>
                  <h2>Preferências</h2>
                  <div className="editar-small-line"></div>
                </div>
              </div>

              <label className="editar-toggle-row">
                <input
                  type="checkbox"
                  checked={receberNovidades}
                  onChange={() => setReceberNovidades(!receberNovidades)}
                />
                <span className="editar-toggle"></span>

                <div>
                  <strong>Receber novidades por e-mail</strong>
                  <p>Fique por dentro de promoções e novidades.</p>
                </div>
              </label>

              <label className="editar-toggle-row">
                <input
                  type="checkbox"
                  checked={perfilVisivel}
                  onChange={() => setPerfilVisivel(!perfilVisivel)}
                />
                <span className="editar-toggle"></span>

                <div>
                  <strong>Perfil visível para outros usuários</strong>
                  <p>Permite que outros viajantes vejam seu perfil.</p>
                </div>
              </label>
            </div>
          </aside>

          <div className="editar-actions">
            <button type="button" className="editar-cancelar">
              Cancelar
            </button>

            <button type="submit" className="editar-salvar">
              <Save size={20} />
              Salvar alterações
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Configuracoes;