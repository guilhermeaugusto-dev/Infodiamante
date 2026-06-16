import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";

import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

import {
  cancelarAgendamentoGuia,
  confirmarAgendamentoGuia,
  listarAgendamentosDoGuia,
  type AgendamentoGuia,
} from "../../servicos/agendamentoGuiaService";

import "./PainelGuia.css";

function PainelGuia() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoGuia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [processandoId, setProcessandoId] = useState<number | null>(null);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  async function carregarAgendamentos() {
    try {
      setCarregando(true);
      setErro("");

      const data = await listarAgendamentosDoGuia();

      setAgendamentos(data);
    } catch (error) {
      console.log("Erro ao carregar agendamentos do guia:", error);
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar agendamentos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  async function confirmar(id: number) {
    try {
      setProcessandoId(id);

      await confirmarAgendamentoGuia(id);

      setAgendamentos((agendamentosAtuais) =>
        agendamentosAtuais.map((agendamento) =>
          agendamento.id === id
            ? { ...agendamento, status: "CONFIRMADO" }
            : agendamento
        )
      );
    } catch (error) {
      console.log("Erro ao confirmar agendamento:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao confirmar agendamento."
      );
    } finally {
      setProcessandoId(null);
    }
  }

  async function cancelar(id: number) {
    try {
      setProcessandoId(id);

      await cancelarAgendamentoGuia(id);

      setAgendamentos((agendamentosAtuais) =>
        agendamentosAtuais.map((agendamento) =>
          agendamento.id === id
            ? { ...agendamento, status: "CANCELADO" }
            : agendamento
        )
      );
    } catch (error) {
      console.log("Erro ao cancelar agendamento:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao cancelar agendamento."
      );
    } finally {
      setProcessandoId(null);
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatarValor(valor?: string | number | null) {
    if (!valor) return "Valor não informado";

    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const agendamentosFiltrados = useMemo(() => {
    if (filtroStatus === "TODOS") return agendamentos;

    return agendamentos.filter(
      (agendamento) => agendamento.status === filtroStatus
    );
  }, [agendamentos, filtroStatus]);

  const totalPendentes = agendamentos.filter(
    (agendamento) => agendamento.status === "PENDENTE"
  ).length;

  const totalConfirmados = agendamentos.filter(
    (agendamento) => agendamento.status === "CONFIRMADO"
  ).length;

  const totalCancelados = agendamentos.filter(
    (agendamento) => agendamento.status === "CANCELADO"
  ).length;

  return (
    <div className="painel-guia-page">
      <Navbar />

      <main className="painel-guia-main">
        <section className="painel-guia-hero">
          <div>
            <h1>Painel do Guia</h1>
            <p>
              Gerencie os agendamentos recebidos, confirme solicitações e
              acompanhe seus clientes.
            </p>
          </div>

          <div className="painel-guia-icon">
            <Calendar size={96} />
          </div>
        </section>

        <section className="painel-guia-resumo">
          <div className="painel-guia-resumo-card">
            <Clock size={28} />
            <div>
              <strong>{totalPendentes}</strong>
              <span>Pendentes</span>
            </div>
          </div>

          <div className="painel-guia-resumo-card confirmado">
            <CheckCircle size={28} />
            <div>
              <strong>{totalConfirmados}</strong>
              <span>Confirmados</span>
            </div>
          </div>

          <div className="painel-guia-resumo-card cancelado">
            <XCircle size={28} />
            <div>
              <strong>{totalCancelados}</strong>
              <span>Cancelados</span>
            </div>
          </div>
        </section>

        <section className="painel-guia-filtros">
          <button
            type="button"
            className={filtroStatus === "TODOS" ? "active" : ""}
            onClick={() => setFiltroStatus("TODOS")}
          >
            Todos
          </button>

          <button
            type="button"
            className={filtroStatus === "PENDENTE" ? "active" : ""}
            onClick={() => setFiltroStatus("PENDENTE")}
          >
            Pendentes
          </button>

          <button
            type="button"
            className={filtroStatus === "CONFIRMADO" ? "active" : ""}
            onClick={() => setFiltroStatus("CONFIRMADO")}
          >
            Confirmados
          </button>

          <button
            type="button"
            className={filtroStatus === "CANCELADO" ? "active" : ""}
            onClick={() => setFiltroStatus("CANCELADO")}
          >
            Cancelados
          </button>
        </section>

        {carregando ? (
          <div className="painel-guia-empty">
            <h2>Carregando agendamentos...</h2>
          </div>
        ) : erro ? (
          <div className="painel-guia-empty">
            <h2>{erro}</h2>
            <p>Verifique se seu usuário possui cadastro como guia.</p>
          </div>
        ) : agendamentosFiltrados.length === 0 ? (
          <div className="painel-guia-empty">
            <h2>Nenhum agendamento encontrado</h2>
            <p>Quando alguém solicitar seu serviço, aparecerá aqui.</p>
          </div>
        ) : (
          <section className="painel-guia-grid">
            {agendamentosFiltrados.map((agendamento) => (
              <article className="painel-guia-card" key={agendamento.id}>
                <div className="painel-guia-card-header">
                  <span
                    className={`painel-guia-status ${agendamento.status.toLowerCase()}`}
                  >
                    {agendamento.status}
                  </span>

                  <span className="painel-guia-data">
                    <Calendar size={15} />
                    {formatarData(agendamento.data)}
                  </span>
                </div>

                <div className="painel-guia-user">
                  {agendamento.usuario?.fotoUrl ? (
                    <img
                      src={agendamento.usuario.fotoUrl}
                      alt={agendamento.usuario.nome}
                    />
                  ) : (
                    <div className="painel-guia-avatar">
                      <User size={28} />
                    </div>
                  )}

                  <div>
                    <h2>{agendamento.usuario?.nome || "Usuário"}</h2>
                    <p>{agendamento.usuario?.cidade || "Cidade não informada"}</p>
                  </div>
                </div>

                <div className="painel-guia-info-list">
                  <p>
                    <Clock size={16} />
                    <strong>Horas:</strong> {agendamento.horas}
                  </p>

                  <p>
                    <Mail size={16} />
                    <strong>Email:</strong>{" "}
                    {agendamento.usuario?.email || "Não informado"}
                  </p>

                  <p>
                    <Phone size={16} />
                    <strong>Telefone:</strong>{" "}
                    {agendamento.usuario?.telefone || "Não informado"}
                  </p>

                  <p>
                    <MapPin size={16} />
                    <strong>Valor:</strong>{" "}
                    {formatarValor(agendamento.valorTotal)}
                  </p>
                </div>

                <div className="painel-guia-observacoes">
                  <strong>Observações</strong>
                  <p>
                    {agendamento.observacoes ||
                      "O usuário não deixou observações."}
                  </p>
                </div>

                {agendamento.status === "PENDENTE" && (
                  <div className="painel-guia-actions">
                    <button
                      type="button"
                      className="painel-guia-confirmar"
                      onClick={() => confirmar(agendamento.id)}
                      disabled={processandoId === agendamento.id}
                    >
                      <CheckCircle size={18} />
                      {processandoId === agendamento.id
                        ? "Confirmando..."
                        : "Confirmar"}
                    </button>

                    <button
                      type="button"
                      className="painel-guia-cancelar"
                      onClick={() => cancelar(agendamento.id)}
                      disabled={processandoId === agendamento.id}
                    >
                      <XCircle size={18} />
                      {processandoId === agendamento.id
                        ? "Cancelando..."
                        : "Cancelar"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default PainelGuia;