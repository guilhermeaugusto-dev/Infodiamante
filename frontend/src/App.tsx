import { Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login-cadastro/Login";
import Signup from "./pages/Login-cadastro/Signup";
import PontosTuristicos from "./pages/PontosTuristicos/PontosTuristicos";
import CriarRoteiro from "./pages/CriarRoteiro/criarRoteiro";
import Guias from "./pages/Guias/guias";
import Avaliacoes from "./pages/Avaliacoes/Avaliacoes";
import PublicRoute from "./routes/PublicRoute";

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
    </Routes>
  );
}

export default App;
