import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isButtonHovered, setIsButtonHovered] = useState(false); // Para o efeito de hover no botão
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      alert("Todos os campos devem ser preenchidos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    axios
      .post("http://localhost:3000/usuarios", { username, password })
      .then(() => {
        alert("Registrado com sucesso!");
        navigate("/login");
      })
      .catch((error) => {
        alert("Erro ao registrar. Nome de usuário pode estar em uso.");
        console.error("Erro ao registrar:", error);
      });
  };

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: 'url("/images/logo3.jpg")', // Caminho correto para a imagem de fundo
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    box: {
      backgroundColor: "#a0e7e5",
      padding: "50px 40px",
      borderRadius: "10px",
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      maxWidth: "500px",
      width: "100%",
    },
    inputWrapper: {
      position: "relative",
      marginBottom: "20px",
    },
    icon: {
      position: "absolute",
      top: "50%",
      left: "10px",
      transform: "translateY(-50%)",
      color: "#666",
      fontSize: "20px",
    },
    input: {
      width: "100%",
      padding: "15px 50px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "20px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "16px",
      backgroundColor: isButtonHovered ? "#3fb5a8" : "#4ecdc4",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "18px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    loginLink: {
      marginTop: "25px",
      fontSize: "22px",
      color: "#333",
    },
    loginBtn: {
      background: "none",
      border: "none",
      color: "#333",
      textDecoration: "underline",
      fontSize: "19px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Crie sua conta</h2>
        <p style={{ fontSize: "18px", marginBottom: "30px" }}>
          Preencha os campos para se registrar
        </p>

        {/* Campo de Nome de Usuário */}
        <div style={styles.inputWrapper}>
          <FontAwesomeIcon icon={faUser} style={styles.icon} />
          <input
            type="text"
            placeholder="Nome de Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Campo de Senha */}
        <div style={styles.inputWrapper}>
          <FontAwesomeIcon icon={faLock} style={styles.icon} />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Campo de Confirmar Senha */}
        <div style={styles.inputWrapper}>
          <FontAwesomeIcon icon={faLock} style={styles.icon} />
          <input
            type="password"
            placeholder="Confirme a Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Botão de Registro */}
        <button
          onClick={handleRegister}
          style={styles.button}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Registrar
        </button>

        {/* Link para Voltar ao Login */}
        <div style={styles.loginLink}>
          <p>Já tem uma conta?</p>
          <button style={styles.loginBtn} onClick={() => navigate("/login")}>
            Voltar ao Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
