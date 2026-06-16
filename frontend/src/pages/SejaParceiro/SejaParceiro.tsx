import { Building2, Handshake, Megaphone, Users } from "lucide-react";

import Navbar from "../../componentes/Navbar/navbar";
import Footer from "../../componentes/Footer/footer";

import "./SejaParceiro.css";

function SejaParceiro() {
  return (
    <div className="seja-parceiro-page">
      <Navbar />

      <main className="seja-parceiro-main">
        <section className="parceiro-hero">
          <div className="parceiro-hero-content">
            <span className="parceiro-tag">Parcerias</span>

            <h1>Seja parceiro do Descubra Minha Cidade</h1>

            <p>
              Divulgue seu negócio, atraia mais visitantes e faça parte de uma
              plataforma que valoriza o turismo, a cultura e a economia local.
            </p>

            <button type="button" className="parceiro-button">
              Quero ser parceiro
            </button>
          </div>

          <div className="parceiro-hero-card">
            <Handshake size={58} />
            <h2>Conecte seu negócio aos turistas</h2>
            <p>
              Hotéis, restaurantes, lojas, agências e serviços locais podem
              ganhar mais visibilidade dentro da plataforma.
            </p>
          </div>
        </section>

        <section className="parceiro-beneficios">
          <h2>Por que ser parceiro?</h2>

          <div className="beneficios-grid">
            <div className="beneficio-card">
              <Megaphone size={34} />
              <h3>Mais visibilidade</h3>
              <p>
                Seu negócio pode aparecer para usuários interessados em turismo
                e experiências locais.
              </p>
            </div>

            <div className="beneficio-card">
              <Users size={34} />
              <h3>Mais clientes</h3>
              <p>
                Alcance visitantes que estão planejando roteiros e buscando
                serviços na cidade.
              </p>
            </div>

            <div className="beneficio-card">
              <Building2 size={34} />
              <h3>Valorização local</h3>
              <p>
                Faça parte de uma rede que fortalece o comércio, a cultura e o
                turismo regional.
              </p>
            </div>
          </div>
        </section>

        <section className="parceiro-form-section">
          <div className="parceiro-form-info">
            <h2>Cadastre seu interesse</h2>
            <p>
              Preencha seus dados para que nossa equipe entre em contato e
              apresente as possibilidades de parceria.
            </p>
          </div>

          <form className="parceiro-form">
            <label>
              Nome do responsável
              <input type="text" placeholder="Digite seu nome" />
            </label>

            <label>
              Nome do negócio
              <input type="text" placeholder="Ex: Restaurante Diamantina" />
            </label>

            <label>
              Tipo de negócio
              <select defaultValue="">
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="hotel">Hotel/Pousada</option>
                <option value="restaurante">Restaurante</option>
                <option value="loja">Loja/Comércio</option>
                <option value="agencia">Agência de turismo</option>
                <option value="outro">Outro</option>
              </select>
            </label>

            <label>
              Telefone ou WhatsApp
              <input type="text" placeholder="(00) 00000-0000" />
            </label>

            <label>
              Mensagem
              <textarea placeholder="Conte um pouco sobre seu negócio" />
            </label>

            <button type="submit">Enviar solicitação</button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default SejaParceiro;