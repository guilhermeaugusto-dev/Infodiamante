import { useState } from "react";
import { Save, ImagePlus, UserCheck } from "lucide-react";

import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";
import { useUser } from "../../contexts/UserContext";
import { cadastrarMeuGuia } from "../../servicos/guiaService";

import "./CadastrarGuia.css";

function SejaGuia() {
  const { usuario, carregarUsuario } = useUser();

  const [biografia, setBiografia] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [idiomas, setIdiomas] = useState("");
  const [precoPorHora, setPrecoPorHora] = useState("");
  const [anosExperiencia, setAnosExperiencia] = useState("");

  const [imagemArquivo, setImagemArquivo] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  function carregarImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    setImagemArquivo(arquivo);
    setPreviewImagem(URL.createObjectURL(arquivo));
  }

  async function enviarSolicitacao(e: React.FormEvent) {
    e.preventDefault();

    if (!especialidade.trim()) {
      setMensagem("Informe sua especialidade.");
      return;
    }

   try {
  setCarregando(true);
  setMensagem("");

  await cadastrarMeuGuia({
    biografia,
    especialidade,
    idiomas,
    precoPorHora,
    anosExperiencia,
    imagemArquivo,
  });

  await carregarUsuario();

  setMensagem(
    "Cadastro enviado com sucesso! Agora você possui um perfil de guia."
  );

  setBiografia("");
  setEspecialidade("");
  setIdiomas("");
  setPrecoPorHora("");
  setAnosExperiencia("");
  setImagemArquivo(null);
  setPreviewImagem("");
} catch (error) {
  console.log("Erro ao solicitar cadastro como guia:", error);
  setMensagem(
    error instanceof Error
      ? error.message
      : "Erro ao solicitar cadastro como guia."
  );
} finally {
  setCarregando(false);
}
  return (
    <div className="seja-guia-page">
      <Navbar />

      <main className="seja-guia-main">
        <section className="seja-guia-title-area">
          <div>
            <h1>Seja um Guia</h1>

            <p>
              Complete seu perfil profissional para aparecer como guia turístico
              na plataforma.
            </p>

            <div className="seja-guia-user-box">
              <strong>{usuario?.nome || "Usuário"}</strong>
              <span>{usuario?.email || "E-mail não informado"}</span>
              <span>{usuario?.telefone || "Telefone não informado"}</span>
              <span>{usuario?.cidade || "Cidade não informada"}</span>
            </div>

            <div className="seja-guia-title-line">
              <span></span>
            </div>
          </div>

          <div className="seja-guia-decoration">
            <UserCheck size={120} />
          </div>
        </section>

        <form className="seja-guia-card" onSubmit={enviarSolicitacao}>
          <section className="seja-guia-imagem-card">
            <div className="seja-guia-preview">
              {previewImagem ? (
                <img src={previewImagem} alt="Prévia do guia" />
              ) : usuario?.fotoUrl ? (
                <img src={usuario.fotoUrl} alt="Foto do usuário" />
              ) : (
                <div className="seja-guia-placeholder">
                  <ImagePlus size={46} />
                  <span>Imagem profissional do guia</span>
                </div>
              )}
            </div>

            <label className="seja-guia-imagem-btn">
              <ImagePlus size={18} />
              Escolher imagem
              <input
                type="file"
                accept="image/*"
                onChange={carregarImagem}
                hidden
              />
            </label>

            <p>
              Se não escolher uma imagem, será usada a foto do seu perfil.
            </p>
          </section>

          <section className="seja-guia-form-area">
            <div className="seja-guia-form-grid">
              <div className="seja-guia-group">
                <label>Especialidade</label>
                <input
                  type="text"
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                  placeholder="Ex: História e Cultura"
                />
              </div>

              <div className="seja-guia-group">
                <label>Idiomas</label>
                <input
                  type="text"
                  value={idiomas}
                  onChange={(e) => setIdiomas(e.target.value)}
                  placeholder="Ex: Português, Inglês"
                />
              </div>

              <div className="seja-guia-group">
                <label>Preço por hora</label>
                <input
                  type="number"
                  value={precoPorHora}
                  onChange={(e) => setPrecoPorHora(e.target.value)}
                  placeholder="Ex: 50.00"
                  step="0.01"
                />
              </div>

              <div className="seja-guia-group">
                <label>Anos de experiência</label>
                <input
                  type="number"
                  value={anosExperiencia}
                  onChange={(e) => setAnosExperiencia(e.target.value)}
                  placeholder="Ex: 3"
                />
              </div>

              <div className="seja-guia-group full">
                <label>Biografia profissional</label>
                <textarea
                  value={biografia}
                  onChange={(e) => setBiografia(e.target.value)}
                  placeholder="Conte um pouco sobre sua experiência como guia..."
                />
              </div>
            </div>

            {mensagem && (
              <div
                className={
                  mensagem.includes("sucesso")
                    ? "seja-guia-message sucesso"
                    : "seja-guia-message erro"
                }
              >
                <strong>{mensagem}</strong>
              </div>
            )}

            <div className="seja-guia-actions">
              <button
                type="submit"
                className="seja-guia-salvar"
                disabled={carregando}
              >
                <Save size={20} />
                {carregando ? "Enviando..." : "Enviar solicitação"}
              </button>
            </div>
          </section>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default SejaGuia;