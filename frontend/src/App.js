import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import Alunos from "./pages/Alunos";
import Avaliacoes from "./pages/Avaliacoes";
import Backup from "./pages/Backup";
import AvaliacaoMasculina from "./pages/AvaliacaoMasculina";
import AvaliacaoFeminina from "./pages/AvaliacaoFeminina";
import VisualizarAvaliacoes from "./pages/VisualizarAvaliacoes";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/login" /> : <Navigate to="/dashboard" />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {isLoggedIn && (
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route />
          <Route path="alunos" element={<Alunos />} />
          <Route path="avaliacoes" element={<Avaliacoes />} />
          <Route path="backup" element={<Backup />} />
          <Route path="avaliacao-masculina" element={<AvaliacaoMasculina />} />
          <Route path="avaliacao-feminina" element={<AvaliacaoFeminina />} />
          <Route path="visualizar-avaliacoes" element={<VisualizarAvaliacoes />} />
        </Route>
      )}
      {/* Adicione uma rota de fallback para páginas não encontradas */}
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default App;