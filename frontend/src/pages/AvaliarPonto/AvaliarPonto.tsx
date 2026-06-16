import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

import { criarAvaliacao } from "../../servicos/avaliacaoService";
import { buscarPontoTuristicoPorId } from "../../servicos/pontoTuristicoService";
import "./AvaliarPonto.css";
import type { PontoTuristico } from "../PontosTuristicos/PontosTuristicos";

function AvaliarPonto() {
  const { pontoId } = useParams();
  const navigate = useNavigate();

  const [ponto, setPonto] = useState<PontoTuristico | null>(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoPonto, setCarregandoPonto] = useState(true);

  useEffect(() => {
    async function carregarPonto() {
      try {
        if (!pontoId) {
          setMensagem("Ponto turístico não informado.");
          return;
        }

        const data = await buscarPontoTuristicoPorId(Number(pontoId));
        setPonto(data);
      } catch (error) {
        console.log("Erro ao carregar ponto:", error);
        setMensagem(
          error instanceof Error
            ? error.message
            : "Erro ao carregar ponto turístico."
        );
      } finally {
        setCarregandoPonto(false);
      }
    }

    carregarPonto();
  }, [pontoId]);

  async function enviarAvaliacao(e: React.FormEvent) {
    e.preventDefault();

    if (!pontoId) {
      setMensagem("Ponto turístico não informado.");
      return;
    }

    if (!comentario.trim()) {
      setMensagem("Escreva um comentário sobre sua experiência.");
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");

      await criarAvaliacao({
        pontoTuristicoId: Number(pontoId),
        nota,
        comentario,
      });

      setMensagem("Avaliação enviada com sucesso!");

      setTimeout(() => {
        navigate("/avaliacoes");
      }, 1200);
    } catch (error) {
      console.log("Erro ao enviar avaliação:", error);

      setMensagem(
        error instanceof Error ? error.message : "Erro ao enviar avaliação."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="avaliar-ponto-page">
      <Navbar />

      <main className="avaliar-ponto-container">
        <section className="avaliar-ponto-card">
          {carregandoPonto ? (
            <h1>Carregando ponto turístico...</h1>
          ) : (
            <>
              <h1>Avaliar ponto turístico</h1>

              <div className="avaliar-ponto-info">
                <h2>{ponto?.nome || "Ponto turístico"}</h2>

                <p>
                  {ponto?.cidade || "Cidade não informada"} -{" "}
                  {ponto?.estado || "UF"}
                </p>
              </div>

              <form onSubmit={enviarAvaliacao}>
                <div className="avaliar-ponto-group">
                  <label>Nota</label>

                  <select
                    value={nota}
                    onChange={(e) => setNota(Number(e.target.value))}
                  >
                    <option value={5}>5 - Excelente</option>
                    <option value={4}>4 - Muito bom</option>
                    <option value={3}>3 - Bom</option>
                    <option value={2}>2 - Regular</option>
                    <option value={1}>1 - Ruim</option>
                  </select>
                </div>

                <div className="avaliar-ponto-stars">
                  {"★".repeat(nota)}
                  {"☆".repeat(5 - nota)}
                </div>

                <div className="avaliar-ponto-group">
                  <label>Comentário</label>

                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Conte como foi sua experiência nesse local..."
                  />
                </div>

                {mensagem && (
                  <p
                    className={
                      mensagem.includes("sucesso")
                        ? "avaliar-ponto-message sucesso"
                        : "avaliar-ponto-message erro"
                    }
                  >
                    {mensagem}
                  </p>
                )}

                <div className="avaliar-ponto-actions">
                  <button
                    type="button"
                    className="avaliar-ponto-voltar"
                    onClick={() => navigate(-1)}
                  >
                    Voltar
                  </button>

                  <button
                    type="submit"
                    className="avaliar-ponto-enviar"
                    disabled={carregando}
                  >
                    {carregando ? "Enviando..." : "Enviar avaliação"}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AvaliarPonto;