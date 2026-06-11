import { useState } from "react";
import { ImagePlus, MapPin, Save, Landmark, CheckCircle } from "lucide-react";

import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";
import { cadastrarPontoTuristico } from "../../servicos/pontoTuristicoService";

import "./CadastrarPontoTuristico.css";

function CadastrarPontoTuristico() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [regiaoId, setRegiaoId] = useState("");
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

  async function salvarPontoTuristico(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !descricao || !cidade || !estado || !categoriaId) {
      setMensagem("Preencha nome, descrição, cidade, estado e categoria.");
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");

      await cadastrarPontoTuristico({
        nome,
        descricao,
        endereco,
        cidade,
        estado,
        latitude,
        longitude,
        categoriaId,
        regiaoId,
        imagemArquivo,
      });

      setMensagem("Ponto turístico cadastrado com sucesso!");

      setNome("");
      setDescricao("");
      setEndereco("");
      setCidade("");
      setEstado("");
      setLatitude("");
      setLongitude("");
      setCategoriaId("");
      setRegiaoId("");
      setImagemArquivo(null);
      setPreviewImagem("");
    } catch (error) {
      console.log("Erro ao cadastrar ponto turístico:", error);
      setMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar ponto turístico."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-ponto-page">
      <Navbar />

      <main className="cadastro-ponto-main">
        <section className="cadastro-ponto-title-area">
          <div>
            <h1>Cadastrar Ponto Turístico</h1>
            <p>
              Adicione novos locais turísticos para enriquecer o guia da cidade.
            </p>

            <div className="cadastro-ponto-title-line">
              <span></span>
            </div>
          </div>

          <div className="cadastro-ponto-decoration">
            <Landmark size={120} />
          </div>
        </section>

        <form className="cadastro-ponto-card" onSubmit={salvarPontoTuristico}>
          <section className="cadastro-ponto-imagem-card">
            <div className="cadastro-ponto-preview">
              {previewImagem ? (
                <img src={previewImagem} alt="Prévia do ponto turístico" />
              ) : (
                <div className="cadastro-ponto-placeholder">
                  <ImagePlus size={46} />
                  <span>Imagem do ponto turístico</span>
                </div>
              )}
            </div>

            <label className="cadastro-ponto-imagem-btn">
              <ImagePlus size={18} />
              Escolher imagem
              <input
                type="file"
                accept="image/*"
                onChange={carregarImagem}
                hidden
              />
            </label>

            <p>JPG, PNG ou WEBP. Máx. 5MB.</p>
          </section>

          <section className="cadastro-ponto-form-area">
            <div className="cadastro-ponto-form-grid">
              <div className="cadastro-ponto-group full">
                <label>Nome do ponto turístico</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Igreja de São Francisco de Assis"
                />
              </div>

              <div className="cadastro-ponto-group full">
                <label>Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva a história, importância e características do local..."
                />
              </div>

              <div className="cadastro-ponto-group full">
                <label>Endereço</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Centro Histórico"
                />
              </div>

              <div className="cadastro-ponto-group">
                <label>Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: Diamantina"
                />
              </div>

              <div className="cadastro-ponto-group">
                <label>Estado</label>
                <input
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  placeholder="Ex: MG"
                  maxLength={2}
                />
              </div>

              <div className="cadastro-ponto-group">
                <label>Latitude</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Ex: -18.24123000"
                />
              </div>

              <div className="cadastro-ponto-group">
                <label>Longitude</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Ex: -43.60345000"
                />
              </div>

              <div className="cadastro-ponto-group">
                <label>ID da Categoria</label>
                <input
                  type="number"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  placeholder="Ex: 1"
                />
              </div>

              <div className="cadastro-ponto-group">
                <label>ID da Região</label>
                <input
                  type="number"
                  value={regiaoId}
                  onChange={(e) => setRegiaoId(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>

            {mensagem && (
              <div
                className={
                  mensagem.includes("sucesso")
                    ? "cadastro-ponto-message sucesso"
                    : "cadastro-ponto-message erro"
                }
              >
                <CheckCircle size={26} />
                <strong>{mensagem}</strong>
              </div>
            )}

            <div className="cadastro-ponto-actions">
              <button type="button" className="cadastro-ponto-cancelar">
                Cancelar
              </button>

              <button
                type="submit"
                className="cadastro-ponto-salvar"
                disabled={carregando}
              >
                <Save size={20} />
                {carregando ? "Salvando..." : "Cadastrar ponto turístico"}
              </button>
            </div>
          </section>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default CadastrarPontoTuristico;