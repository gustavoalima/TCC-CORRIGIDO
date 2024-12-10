import React, { useState, useEffect } from "react";
// Adicione a biblioteca de ícones
import { FaSearch, FaEdit, FaTrash, FaSave } from "react-icons/fa";

const Alunos = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cep: "",
    endereco: "",
    dataNascimento: "",
    idade: "",
    sexo: "",
  });
  const [alunos, setAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAlunos();
  }, []);

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

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredAlunos(alunos);
    } else {
      setFilteredAlunos(
        alunos.filter((aluno) =>
          aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    if (name === "cep" && value.length === 8) {
      fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              endereco: `${data.logradouro}, `,
            }));
          } else {
            alert("CEP não encontrado.");
          }
        })
        .catch((err) => console.error("Erro ao buscar o CEP:", err));
    }
  
    if (name === "dataNascimento") {
      const hoje = new Date();
      const nascimento = new Date(value);
      
      if (
        nascimento.getFullYear() > hoje.getFullYear() || 
        (nascimento.getFullYear() === hoje.getFullYear() && nascimento.getMonth() > hoje.getMonth()) ||
        (nascimento.getFullYear() === hoje.getFullYear() && nascimento.getMonth() === hoje.getMonth() && nascimento.getDate() > hoje.getDate())
      ) {
        alert("A data de nascimento não pode ser maior que a data atual.");
        setFormData((prev) => ({ ...prev, dataNascimento: "" })); // Limpa o campo de data de nascimento
        return; // Para a execução do código
      }
    
      const idade =
        hoje.getFullYear() -
        nascimento.getFullYear() -
        (hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()) ? 1 : 0);
      setFormData((prev) => ({ ...prev, idade: idade > 0 ? idade : "" }));
    }
    
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.cep || !formData.endereco || !formData.dataNascimento || !formData.idade || !formData.sexo) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `http://localhost:3000/alunos/${editingId}` : "http://localhost:3000/alunos";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          cep: formData.cep,
          endereco: formData.endereco,
          data_nascimento: formData.dataNascimento,
          idade: formData.idade,
          sexo: formData.sexo,
        }),
      });

      if (response.ok) {
        alert(editingId ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
        setFormData({
          nome: "",
          cep: "",
          endereco: "",
          dataNascimento: "",
          idade: "",
          sexo: "",
        });
        setEditingId(null);
        fetchAlunos();
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar aluno: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro ao salvar aluno.");
    }
  };

  const handleEdit = (aluno) => {
    setEditingId(aluno.id);
    setFormData({
      nome: aluno.nome,
      cep: aluno.cep,
      endereco: aluno.endereco,
      dataNascimento: aluno.data_nascimento,
      idade: aluno.idade,
      sexo: aluno.sexo,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
      const response = await fetch(`http://localhost:3000/alunos/${id}`, { method: "DELETE" });
      if (response.ok) {
        alert("Aluno excluído com sucesso!");
        fetchAlunos();
      } else {
        alert("Erro ao excluir aluno.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#f4f7fc",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#34495e",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        Gestão de Alunos
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {[
          { label: "Nome", name: "nome", type: "text", placeholder: "Digite o nome do aluno" },
          { label: "CEP", name: "cep", type: "text", placeholder: "Digite o CEP" },
          { label: "Endereço", name: "endereco", type: "text", placeholder: "Endereço será preenchido automaticamente" },
          { label: "Data de Nascimento", name: "dataNascimento", type: "date", placeholder: "Digite a data de nascimento" },
          { label: "Idade", name: "idade", type: "text", placeholder: "Idade será calculada automaticamente", readOnly: true },
          { label: "Sexo", name: "sexo", type: "select" },
        ].map(({ label, name, type, placeholder, readOnly }) => (
          <div key={name} style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#34495e", fontWeight: "bold" }}>
              {label}:
            </label>
            {type === "select" ? (
              <select
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
              >
                <option value="">Selecione o sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                readOnly={readOnly}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1abc9c",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaSave style={{ marginRight: "10px" }} />
          {editingId ? "Atualizar Aluno" : "Cadastrar Aluno"}
        </button>
      </form>

      <div
        style={{
          maxWidth: "900px",
          margin: "20px auto",
          padding: "10px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar aluno por nome"
          style={{
            width: "80%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 15px",
            backgroundColor: "#3498db",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <FaSearch />
        </button>
      </div>

      <div style={{ maxWidth: "800px", margin: "20px auto" }}>
        <h3 style={{ marginBottom: "10px", color: "#34495e", textAlign: "center" }}>
          Alunos Cadastrados
        </h3>
        {filteredAlunos.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Nome", "Endereço", "Idade", "Sexo", "Ações"].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: "10px",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "2px solid #ccc",
                      fontSize: "16px",
                      color: "#2c3e50",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAlunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {aluno.nome}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {aluno.endereco}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {aluno.idade}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {aluno.sexo}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(aluno)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#f1c40f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        marginRight: "5px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <FaEdit style={{ marginRight: "5px" }} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(aluno.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <FaTrash style={{ marginRight: "5px" }} />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>Nenhum aluno encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Alunos;
