import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const VisualizarAvaliacoes = () => {
  const { state } = useLocation();
  const alunoId = state?.alunoId;

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState(null);
  const [penultimaAvaliacao, setPenultimaAvaliacao] = useState(null);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/avaliacoes/${alunoId}`);
        if (response.ok) {
          const data = await response.json();
          const sortedAvaliacoes = data.sort(
            (a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao)
          );
          setAvaliacoes(sortedAvaliacoes);
          setUltimaAvaliacao(sortedAvaliacoes[0]);
          setPenultimaAvaliacao(sortedAvaliacoes[1]);
        } else {
          console.error("Erro ao buscar avaliações:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    };

    fetchAvaliacoes();
  }, [alunoId]);

  const calculateDifference = (ultima, penultima) => {
    const diff = ultima - penultima;
    const arrow = diff > 0 ? "⬆" : diff < 0 ? "⬇" : "⬅";
    return `${diff.toFixed(2)} ${arrow}`;
  };

  const generatePDF = () => {
    if (!ultimaAvaliacao || !penultimaAvaliacao) {
      alert("É necessário ter pelo menos duas avaliações para gerar o PDF.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório de Avaliações", 20, 20);

    doc.setFontSize(12);
    doc.text("Detalhes das duas últimas avaliações:", 20, 30);
    doc.autoTable({
      startY: 35,
      head: [["Campo", "Última Avaliação", "Penúltima Avaliação"]],
      body: [
        [
          "Data e Hora",
          new Date(ultimaAvaliacao.data_avaliacao).toLocaleString(),
          new Date(penultimaAvaliacao.data_avaliacao).toLocaleString(),
        ],
        ["Peso (kg)", ultimaAvaliacao.peso, penultimaAvaliacao.peso],
        ["Altura (cm)", ultimaAvaliacao.altura, penultimaAvaliacao.altura],
        ["Peitoral (mm)", ultimaAvaliacao.peitoral, penultimaAvaliacao.peitoral],
        ["Axilar Média (mm)", ultimaAvaliacao.axilar_media, penultimaAvaliacao.axilar_media],
        ["Tríceps (mm)", ultimaAvaliacao.triceps, penultimaAvaliacao.triceps],
        ["Subescapular (mm)", ultimaAvaliacao.subescapular, penultimaAvaliacao.subescapular],
        ["Abdômen (mm)", ultimaAvaliacao.abdomen, penultimaAvaliacao.abdomen],
        ["Supra-ilíaca (mm)", ultimaAvaliacao.supra_iliaca, penultimaAvaliacao.supra_iliaca],
        ["Coxa (mm)", ultimaAvaliacao.coxa, penultimaAvaliacao.coxa],
        ["IMC", ultimaAvaliacao.imc, penultimaAvaliacao.imc],
        ["Percentual de Gordura (%)", ultimaAvaliacao.percentual_gordura, penultimaAvaliacao.percentual_gordura],
        ["Percentual de Massa Magra (%)", ultimaAvaliacao.percentual_massa_magra, penultimaAvaliacao.percentual_massa_magra],
      ],
    });

    doc.text("Comparativo entre as últimas avaliações:", 20, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Campo", "Penúltima Avaliação", "Última Avaliação", "Diferença"]],
      body: [
        ["Peso (kg)", penultimaAvaliacao.peso, ultimaAvaliacao.peso, calculateDifference(ultimaAvaliacao.peso, penultimaAvaliacao.peso)],
        ["Altura (cm)", penultimaAvaliacao.altura, ultimaAvaliacao.altura, calculateDifference(ultimaAvaliacao.altura, penultimaAvaliacao.altura)],
        ["Peitoral (mm)", penultimaAvaliacao.peitoral, ultimaAvaliacao.peitoral, calculateDifference(ultimaAvaliacao.peitoral, penultimaAvaliacao.peitoral)],
        ["Axilar Média (mm)", penultimaAvaliacao.axilar_media, ultimaAvaliacao.axilar_media, calculateDifference(ultimaAvaliacao.axilar_media, penultimaAvaliacao.axilar_media)],
        ["Tríceps (mm)", penultimaAvaliacao.triceps, ultimaAvaliacao.triceps, calculateDifference(ultimaAvaliacao.triceps, penultimaAvaliacao.triceps)],
        ["Subescapular (mm)", penultimaAvaliacao.subescapular, ultimaAvaliacao.subescapular, calculateDifference(ultimaAvaliacao.subescapular, penultimaAvaliacao.subescapular)],
        ["Abdômen (mm)", penultimaAvaliacao.abdomen, ultimaAvaliacao.abdomen, calculateDifference(ultimaAvaliacao.abdomen, penultimaAvaliacao.abdomen)],
        ["Supra-ilíaca (mm)", penultimaAvaliacao.supra_iliaca, ultimaAvaliacao.supra_iliaca, calculateDifference(ultimaAvaliacao.supra_iliaca, penultimaAvaliacao.supra_iliaca)],
        ["Coxa (mm)", penultimaAvaliacao.coxa, ultimaAvaliacao.coxa, calculateDifference(ultimaAvaliacao.coxa, penultimaAvaliacao.coxa)],
        ["IMC", penultimaAvaliacao.imc, ultimaAvaliacao.imc, calculateDifference(ultimaAvaliacao.imc, penultimaAvaliacao.imc)],
        ["Percentual de Gordura (%)", penultimaAvaliacao.percentual_gordura, ultimaAvaliacao.percentual_gordura, calculateDifference(ultimaAvaliacao.percentual_gordura, penultimaAvaliacao.percentual_gordura)],
        ["Percentual de Massa Magra (%)", penultimaAvaliacao.percentual_massa_magra, ultimaAvaliacao.percentual_massa_magra, calculateDifference(ultimaAvaliacao.percentual_massa_magra, penultimaAvaliacao.percentual_massa_magra)],
      ],
    });

    doc.save(`avaliacoes_aluno_${alunoId}.pdf`);
  };

  const handleDelete = async (avaliacaoId) => {
    if (!window.confirm("Tem certeza que deseja apagar esta avaliação?")) return;

    try {
      const response = await fetch(`http://localhost:3000/avaliacoes/${avaliacaoId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Avaliação apagada com sucesso.");
        setAvaliacoes((prevAvaliacoes) =>
          prevAvaliacoes.filter((avaliacao) => avaliacao.id !== avaliacaoId)
        );
      } else {
        console.error("Erro ao apagar avaliação:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Avaliações do Aluno</h2>

      {ultimaAvaliacao && penultimaAvaliacao ? (
        <div style={styles.comparisonContainer}>
          <h3 style={styles.comparisonTitle}>Comparativo das Últimas Avaliações</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Métrica</th>
                <th style={styles.th}>
                  Última Avaliação ({new Date(ultimaAvaliacao.data_avaliacao).toLocaleString()})
                </th>
                <th style={styles.th}>
                  Penúltima Avaliação ({new Date(penultimaAvaliacao.data_avaliacao).toLocaleString()})
                </th>
                <th style={styles.th}>Diferença</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Peso (kg)", ultima: ultimaAvaliacao.peso, penultima: penultimaAvaliacao.peso },
                { label: "Altura (cm)", ultima: ultimaAvaliacao.altura, penultima: penultimaAvaliacao.altura },
                { label: "Peitoral (mm)", ultima: ultimaAvaliacao.peitoral, penultima: penultimaAvaliacao.peitoral },
                { label: "Axilar Média (mm)", ultima: ultimaAvaliacao.axilar_media, penultima: penultimaAvaliacao.axilar_media },
                { label: "Tríceps (mm)", ultima: ultimaAvaliacao.triceps, penultima: penultimaAvaliacao.triceps },
                { label: "Subescapular (mm)", ultima: ultimaAvaliacao.subescapular, penultima: penultimaAvaliacao.subescapular },
                { label: "Abdômen (mm)", ultima: ultimaAvaliacao.abdomen, penultima: penultimaAvaliacao.abdomen },
                { label: "Supra-ilíaca (mm)", ultima: ultimaAvaliacao.supra_iliaca, penultima: penultimaAvaliacao.supra_iliaca },
                { label: "Coxa (mm)", ultima: ultimaAvaliacao.coxa, penultima: penultimaAvaliacao.coxa },
                { label: "IMC", ultima: ultimaAvaliacao.imc, penultima: penultimaAvaliacao.imc },
                { label: "Percentual de Gordura (%)", ultima: ultimaAvaliacao.percentual_gordura, penultima: penultimaAvaliacao.percentual_gordura },
                { label: "Percentual de Massa Magra (%)", ultima: ultimaAvaliacao.percentual_massa_magra, penultima: penultimaAvaliacao.percentual_massa_magra },
              ].map((row, index) => (
                <tr key={index}>
                  <td style={styles.td}>{row.label}</td>
                  <td style={styles.td}>{row.ultima}</td>
                  <td style={styles.td}>{row.penultima}</td>
                  <td style={styles.td}>{calculateDifference(row.ultima, row.penultima)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={styles.message}>
          {avaliacoes.length === 1
            ? "Apenas uma avaliação registrada. Adicione mais uma para comparação."
            : "Nenhuma avaliação registrada para este aluno."}
        </p>
      )}

      <h3 style={styles.subtitle}>Todas as Avaliações</h3>
      {avaliacoes.length > 0 ? (
        <ul style={styles.list}>
          {avaliacoes.map((avaliacao) => (
            <li key={avaliacao.id} style={styles.listItem}>
              <p><strong>Data e Hora:</strong> {new Date(avaliacao.data_avaliacao).toLocaleString()}</p>
              <p><strong>Peso:</strong> {avaliacao.peso} kg</p>
              <p><strong>Altura:</strong> {avaliacao.altura} cm</p>
              <p><strong>IMC:</strong> {avaliacao.imc} ({avaliacao.classificacao_imc})</p>
              <p><strong>Percentual de Gordura:</strong> {avaliacao.percentual_gordura}%</p>
              <p><strong>Percentual de Massa Magra:</strong> {avaliacao.percentual_massa_magra}%</p>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(avaliacao.id)}
              >
                Apagar Avaliação
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.message}>Nenhuma avaliação encontrada.</p>
      )}

      <button style={styles.button} onClick={generatePDF}>
        Gerar PDF
      </button>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "'Arial', sans-serif", maxWidth: "800px", margin: "0 auto" },
  title: { textAlign: "center", marginBottom: "20px", fontSize: "24px" },
  comparisonContainer: { marginBottom: "30px" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "20px" },
  th: { border: "1px solid #ddd", padding: "10px", backgroundColor: "#f0f0f0", textAlign: "center" },
  td: { border: "1px solid #ddd", padding: "8px", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" },
  list: { listStyleType: "none", padding: 0 },
  listItem: { padding: "15px", marginBottom: "10px", backgroundColor: "#f9f9f9", borderRadius: "5px" },
  message: { textAlign: "center", fontSize: "16px", color: "#e74c3c" },
  deleteButton: { backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "5px" },
  button: { display: "block", margin: "20px auto", padding: "12px 20px", backgroundColor: "#2c3e50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default VisualizarAvaliacoes;
