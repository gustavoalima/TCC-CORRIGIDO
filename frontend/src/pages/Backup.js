import React, { useState } from "react";
import axios from "axios";

const Backup = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBackup = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/backup", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "backup.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Backup realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer backup:", error);
      if (error.response) {
        console.log("Erro no servidor:", error.response.data);
        alert(`Erro no servidor: ${error.response.status}`);
      } else if (error.request) {
        console.log("Sem resposta do servidor:", error.request);
        alert("Servidor não respondeu.");
      } else {
        console.log("Erro na requisição:", error.message);
        alert("Erro na requisição.");
      }
    }
  };

  const handleRestore = async () => {
    if (
      !file ||
      (file.type !== "application/vnd.ms-excel" && file.type !== "text/csv")
    ) {
      alert("Por favor, selecione um arquivo CSV válido para restaurar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3000/api/restore", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Backup restaurado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao restaurar:", error);
      alert("Erro ao restaurar o backup. Verifique o arquivo e tente novamente.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gerenciamento de Backup</h2>
      <div style={styles.content}>
        <div style={styles.uploadSection}>
          <label htmlFor="fileInput" style={styles.fileLabel}>
            Selecionar Arquivo
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            style={styles.fileInput}
            onChange={handleFileChange}
          />
          {file && <p style={styles.fileName}>{file.name}</p>}
        </div>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleBackup}>
            Fazer Backup
          </button>
          <button style={styles.button} onClick={handleRestore}>
            Restaurar Backup
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  uploadSection: {
    marginBottom: "20px",
    textAlign: "center",
  },
  fileLabel: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  fileInput: {
    display: "none",
  },
  fileName: {
    marginTop: "10px",
    color: "#555",
    fontSize: "14px",
    fontStyle: "italic",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default Backup;
