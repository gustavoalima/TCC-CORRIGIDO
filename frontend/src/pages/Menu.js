import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "250px",
        backgroundColor: "#34495E", // Fundo em azul escuro moderno
        color: "#ECF0F1",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.3)",
        padding: "20px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          fontSize: "32px", // Tamanho maior para o título
          textAlign: "center",
          color: "#1ABC9C",
          fontWeight: "bold",
          textTransform: "uppercase", // Todas as letras maiúsculas
          letterSpacing: "2px", // Espaçamento entre letras
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Efeito de sombra 2D
        }}
      >
        Menu
      </h2>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        <li onClick={() => navigate("/dashboard")} style={menuItemStyle}>
          Dashboard
        </li>
        <li onClick={() => navigate("/dashboard/alunos")} style={menuItemStyle}>
          Alunos
        </li>
        <li
          onClick={() => navigate("/dashboard/avaliacoes")}
          style={menuItemStyle}
        >
          Avaliações
        </li>
        <li onClick={() => navigate("/dashboard/backup")} style={menuItemStyle}>
          Backup
        </li>
        <li onClick={handleLogout} style={menuItemStyle}>
          Logout
        </li>
      </ul>
    </div>
  );
};

const menuItemStyle = {
  padding: "15px 20px",
  cursor: "pointer",
  borderRadius: "12px",
  marginBottom: "15px",
  backgroundColor: "transparent",
  color: "#ECF0F1",
  transition: "all 0.3s ease", // Suaviza as transições
  textAlign: "center",
  fontSize: "20px", // Tamanho maior
  fontWeight: "600",
  textTransform: "uppercase", // Letras maiúsculas
  border: "2px solid #ECF0F1", // Borda visível para botões
  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)", // Sombra de texto
};

menuItemStyle[":hover"] = {
  backgroundColor: "#1ABC9C",
  color: "#FFFFFF",
  boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.4)", // Efeito 2D com sombra
  transform: "translateY(-3px)", // Levanta o botão ao passar o mouse
};

export default Menu;
