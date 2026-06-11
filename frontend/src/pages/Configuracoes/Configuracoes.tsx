import { useEffect, useState } from "react";
import "./Configuracoes.css";
import { atualizarUsuario } from "../../servicos/configuracoes";

function Configuracoes() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    const nomeSalvo = localStorage.getItem("nome");
    const emailSalvo = localStorage.getItem("email");
    const telefoneSalvo = localStorage.getItem("telefone");
    const fotoUrlSalva = localStorage.getItem("fotoUrl");
    console.log("Token salvo:", tokenSalvo);

    if (nomeSalvo) setNome(nomeSalvo);
    if (emailSalvo) setEmail(emailSalvo);
    if (telefoneSalvo) setTelefone(telefoneSalvo);
    if (fotoUrlSalva) setFotoUrl(fotoUrlSalva);
  }, []);

  function carregarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    setFotoArquivo(arquivo);

    const preview = URL.createObjectURL(arquivo);
    setPreviewFoto(preview);
  }

async function salvarAlteracoes(e: React.FormEvent) {
  e.preventDefault();

  if (!nome.trim() || !email.trim()) {
    setMensagem("Nome e email são obrigatórios.");
    return;
  }

  try {
    const data = await atualizarUsuario(nome, email, telefone, fotoArquivo);

    localStorage.setItem("nome", data.usuario.nome);
    localStorage.setItem("email", data.usuario.email);
    localStorage.setItem("telefone", data.usuario.telefone || "");
    localStorage.setItem("fotoUrl", data.usuario.fotoUrl || "");

    setNome(data.usuario.nome);
    setEmail(data.usuario.email);
    setTelefone(data.usuario.telefone || "");
    setFotoUrl(data.usuario.fotoUrl || "");
    setPreviewFoto("");
    setFotoArquivo(null);

    setMensagem("Perfil atualizado com sucesso!");
  } catch (error) {
    console.log("Erro ao atualizar perfil:", error);
    setMensagem("Erro ao atualizar perfil.");
  }
}
  function sairDaConta() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <main className="config-page">
      <section className="config-card">
        <div className="config-header">
          <h1>Configurações</h1>
          <p>Edite as informações do seu perfil</p>
        </div>

        <div className="profile-area">
          <div className="profile-avatar">
            {previewFoto || fotoUrl ? (
              <img src={previewFoto || fotoUrl} alt="Foto do usuário" />
            ) : (
              <span>{nome ? nome.charAt(0).toUpperCase() : "U"}</span>
            )}
          </div>

          <div className="profile-info">
            <h2>{nome || "Usuário"}</h2>
            <span>{email || "email não informado"}</span>

            <label className="btn-carregar-foto">
              Alterar foto
              <input
                type="file"
                accept="image/*"
                onChange={carregarFoto}
                hidden
              />
            </label>
          </div>
        </div>

        <form onSubmit={salvarAlteracoes} className="config-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Digite seu telefone"
            />
          </div>

          {mensagem && <p className="mensagem">{mensagem}</p>}

          <div className="buttons-area">
            <button type="submit" className="btn-salvar">
              Salvar alterações
            </button>

            <button type="button" className="btn-sair" onClick={sairDaConta}>
              Sair da conta
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Configuracoes;