import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Menu from "./Menu";

const DashboardLayout = () => {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Limpar o intervalo ao desmontar o componente
  }, []);

  const isDashboard = location.pathname === "/dashboard"; // Verifica se está na rota Dashboard

  const styles = {
    layout: {
      display: "flex",
    },
    main: {
      marginLeft: "285px",
      padding: "10px",
      flex: 1,
      position: "relative",
      fontFamily: "'Arial', sans-serif",
      backgroundImage: isDashboard ? 'url("/images/logo4.jpeg")' : "none", // Aplica a imagem apenas na rota Dashboard
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
    },
    overlay: {
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "80%",
      margin: "auto",
      marginTop: "20px",
      textAlign: "center",
    },
    welcomeText: {
      fontSize: "45px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#2c3e50",
      textShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
    },
    time: {
      position: "absolute",
      top: "60px",
      right: "90px",
      fontSize: "35px",
      fontWeight: "bold",
      color: "#34495e",
      textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
      transform: "rotateY(15deg)", // Efeito 3D
      fontFamily: "'Courier New', monospace",
    },
  };

  return (
    <div style={styles.layout}>
      <Menu />
      <div style={styles.main}>
        {isDashboard && <div style={styles.time}>{time.toLocaleTimeString()}</div>}
        {isDashboard && (
          <div style={styles.overlay}>
            <div style={styles.welcomeText}>Bem-vindo de volta!</div>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
