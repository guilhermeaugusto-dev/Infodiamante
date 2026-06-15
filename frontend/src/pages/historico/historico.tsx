import { useState } from "react";
import {
  Search,
  Map as MapIcon,
  Star,
  Calendar,
  ArrowDown,
  Heart,
} from "lucide-react";

import Footer from "../../componentes/Footer/footer";
import Navbar from "../../componentes/Navbar/navbar";
import { useUser } from "../../contexts/UserContext";

import HistoricoRoteiros from "../../componentes/HistoricoRoteiros/HistoricoRoteiros";
import HistoricoAvaliacoes from "../../componentes/HistoricoAvaliacoes/HistoricoAvaliacao";
import HistoricoFavoritos from "../../componentes/HistoricoFavoritos/HistoricoFavoritos";
import HistoricoAgendamentos from "../../componentes/HistoricoAgendamentos/HistoricoAgendamentos";

import "./historico.css";

export default function Historico() {
  const [activeTab, setActiveTab] = useState("todos");

  const { usuario } = useUser();

  const roteiros = usuario?.roteiros || [];
  const avaliacoes = usuario?.avaliacoes || [];
  const favoritos = usuario?.favoritos || [];
  const agendamentos = usuario?.agendamentos || [];

  const naoTemHistorico =
    roteiros.length === 0 &&
    avaliacoes.length === 0 &&
    favoritos.length === 0 &&
    agendamentos.length === 0;
    

  function renderizarConteudo() {
    if (activeTab === "todos") {
      if (naoTemHistorico) {
        return (
          <div className="historico-empty">
            <h2>Você ainda não possui histórico</h2>
            <p>
              Quando você criar roteiros, avaliar lugares, favoritar pontos
              turísticos ou agendar guias, essas informações aparecerão aqui.
            </p>
          </div>
        );
      }

      return (
        <section className="historico-grid">
          <HistoricoAvaliacoes />
          <HistoricoFavoritos />
          <HistoricoRoteiros />
          <HistoricoAgendamentos />
        </section>
      );
    }

    return (
      <section className="historico-grid">
        {activeTab === "avaliacoes" && <HistoricoAvaliacoes />}
        {activeTab === "favoritos" && <HistoricoFavoritos />}
        {activeTab === "roteiros" && <HistoricoRoteiros />}
        {activeTab === "agendamentos" && <HistoricoAgendamentos />}
      </section>
    );
  }

  return (
    <div className="historico-page">
      <Navbar />

      <main className="historico-main">
        <section className="historico-title-area">
          <div className="historico-title-content">
            <h1>Seu Histórico</h1>
            <p>
              Relembre os lugares incríveis que você visitou, seus favoritos,
              avaliações, roteiros e agendamentos com guias.
            </p>
          </div>

          <div className="historico-decoration">
            <svg
              width="250"
              height="100"
              viewBox="0 0 200 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 90L30 50L50 90H10Z" fill="#800020" />
              <path d="M40 90L70 30L100 90H40Z" fill="#800020" />
              <path d="M80 90L120 10L160 90H80Z" fill="#800020" />
              <path d="M140 90L165 40L190 90H140Z" fill="#800020" />
              <rect x="110" y="30" width="20" height="60" fill="#800020" />
              <circle cx="120" cy="20" r="10" fill="#800020" />
            </svg>
          </div>
        </section>

        <section className="historico-filter-bar">
          <div className="historico-search-box">
            <Search className="historico-search-icon" />
            <input type="text" placeholder="Buscar no histórico..." />
          </div>

          <div className="historico-selects">
            <div className="historico-select-group">
              <label>Tipo de Registro</label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="todos">Todos os registros</option>
                <option value="roteiros">Roteiros</option>
                <option value="avaliacoes">Avaliações</option>
                <option value="favoritos">Favoritos</option>
                <option value="agendamentos">Agendamentos</option>
              </select>
            </div>

            <div className="historico-select-group">
              <label>Período</label>
              <select>
                <option>Todo o período</option>
                <option>Últimos 6 meses</option>
                <option>Este ano</option>
                <option>Ano passado</option>
              </select>
            </div>

            <div className="historico-select-group">
              <label>Ordenar por</label>
              <select>
                <option>Mais recentes</option>
                <option>Mais antigos</option>
                <option>Maior avaliação</option>
              </select>
            </div>
          </div>

          <button type="button" className="historico-search-button">
            <Search className="icon-sm blue-icon" />
            Buscar
          </button>
        </section>

        <section className="historico-tabs">
    

          <button
            type="button"
            onClick={() => setActiveTab("roteiros")}
            className={activeTab === "roteiros" ? "active" : ""}
          >
            <MapIcon className="icon-sm" />
            Roteiros
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("avaliacoes")}
            className={activeTab === "avaliacoes" ? "active" : ""}
          >
            <Star className="icon-sm" />
            Avaliações
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favoritos")}
            className={activeTab === "favoritos" ? "active" : ""}
          >
            <Heart className="icon-sm" />
            Favoritos
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("agendamentos")}
            className={activeTab === "agendamentos" ? "active" : ""}
          >
            <Calendar className="icon-sm" />
            Agendamentos
          </button>
        </section>

        {renderizarConteudo()}

        {!naoTemHistorico && (
          <div className="historico-load-more">
            <button type="button">
              <ArrowDown className="icon-sm" />
              Carregar mais histórico
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}