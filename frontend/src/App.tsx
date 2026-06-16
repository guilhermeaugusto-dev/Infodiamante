import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login-cadastro/Login";
import Signup from "./pages/Login-cadastro/Signup";
import PontosTuristicos from "./pages/PontosTuristicos/PontosTuristicos";
import CriarRoteiro from "./pages/CriarRoteiro/criarRoteiro";
import Guias from "./pages/Guias/guias";
import Avaliacoes from "./pages/Avaliacoes/Avaliacoes";
import PublicRoute from "./routes/PublicRoute";
import Configuracoes from "./pages/Configuracoes/Configuracoes";
import Historico from "./pages/historico/historico";
import CadastrarPontoTuristico from "./pages/CadastrarPontoTuristico/CadastrarPontoTuristico";
import CriarGuia from "./pages/CadastrarGuia/CadastrarGuia";
import PainelGuia from "./pages/PainelGuia/PainelGuia";
import MapaRoteiro from "./componentes/MapaRoteiro/MapaRoteiro";
import AvaliarPonto from "./pages/AvaliarPonto/AvaliarPonto";
import SejaParceiro from "./pages/SejaParceiro/SejaParceiro";




function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route path="/pontos-turisticos" element={<PontosTuristicos />} />
      <Route path="/criarRoteiro" element={<CriarRoteiro />} />
      <Route path="/guias" element={<Guias />} />
      <Route path="/avaliacoes" element={<Avaliacoes />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/admin/pontos-turisticos/novo" element={<CadastrarPontoTuristico />} />
      <Route path="/seja-guia" element={<CriarGuia />} />
      <Route path="/painel-guia" element={<PainelGuia />} />
      <Route path="/mapa-roteiro" element={<MapaRoteiro />} />
      <Route path="/avaliar-ponto/:pontoId" element={<AvaliarPonto />} />
      <Route path="/seja-parceiro" element={<SejaParceiro />} />
    </Routes>
  );
}

export default App;
