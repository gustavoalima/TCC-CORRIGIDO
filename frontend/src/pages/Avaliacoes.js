import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Importando ícones
import { FaSearch, FaClipboardList, FaEye } from "react-icons/fa";

const Avaliacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await fetch("http://localhost:3000/alunos");
        if (response.ok) {
          const data = await response.json();
          setAlunos(data);
          setFilteredAlunos(data);
        } else {
          console.error("Erro ao buscar alunos:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    };

    fetchAlunos();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredAlunos(alunos);
    } else {
      setFilteredAlunos(
        alunos.filter((aluno) =>
          aluno.nome.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const handleRegisterAvaliacao = (aluno) => {
    if (aluno.sexo === "Masculino") {
      navigate("/dashboard/avaliacao-masculina", {
        state: { alunoId: aluno.id, nome: aluno.nome, idade: aluno.idade },
      });
    } else if (aluno.sexo === "Feminino") {
      navigate("/dashboard/avaliacao-feminina", {
        state: { alunoId: aluno.id, nome: aluno.nome, idade: aluno.idade },
      });
    } else {
      alert("Gênero do aluno não reconhecido.");
    }
  };

  const handleViewAvaliacoes = (aluno) => {
    navigate("/dashboard/visualizar-avaliacoes", { state: { alunoId: aluno.id } });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Avaliações</h2>
      <p style={styles.subtitle}>Busque pelo aluno para registrar ou consultar avaliações.</p>
      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Digite o nome do aluno"
            value={searchTerm}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>
      </div>
      <div>
        <h3 style={styles.resultsTitle}>Resultados:</h3>
        {filteredAlunos.length > 0 ? (
          <ul style={styles.list}>
            {filteredAlunos.map((aluno) => (
              <li key={aluno.id} style={styles.listItem}>
                <div style={styles.listItemDetails}>
                  <span style={styles.listItemText}>{aluno.nome}</span>
                  <span style={styles.listItemSubtext}>{aluno.sexo}</span>
                </div>
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.button}
                    onClick={() => handleRegisterAvaliacao(aluno)}
                  >
                    <FaClipboardList style={styles.buttonIcon} />
                    Registrar Avaliação
                  </button>
                  <button
                    style={{ ...styles.button, backgroundColor: "#7f8c8d" }}
                    onClick={() => handleViewAvaliacoes(aluno)}
                  >
                    <FaEye style={styles.buttonIcon} />
                    Visualizar Avaliações
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noResults}>Nenhum aluno encontrado.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    color: "#34495e",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "16px",
    color: "#7f8c8d",
    marginBottom: "20px",
  },
  searchContainer: {
    marginBottom: "20px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    padding: "0 10px",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
  searchIcon: {
    marginRight: "10px",
    color: "#7f8c8d",
  },
  resultsTitle: {
    fontSize: "20px",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    borderBottom: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
    marginBottom: "10px",
    transition: "background-color 0.3s",
  },
  listItemDetails: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  listItemText: {
    fontWeight: "bold",
    color: "#34495e",
    fontSize: "16px",
    marginRight: "10px", // Espaço entre o nome e o sexo
  },
  listItemSubtext: {
    color: "#7f8c8d",
    fontSize: "14px",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#1abc9c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "background-color 0.3s",
  },
  buttonIcon: {
    fontSize: "16px",
  },
  noResults: {
    textAlign: "center",
    fontSize: "16px",
    color: "#e74c3c",
  },
};

export default Avaliacoes;
