import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AvaliacaoMasculina = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const alunoId = location.state?.alunoId;
  const nomeAluno = location.state?.nome || "";
  const idadeAluno = location.state?.idade || "";

  const [nome, setNome] = useState(nomeAluno);
  const [idade, setIdade] = useState(idadeAluno);
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [peitoral, setPeitoral] = useState("");
  const [axilarMedia, setAxilarMedia] = useState("");
  const [triceps, setTriceps] = useState("");
  const [subescapular, setSubescapular] = useState("");
  const [abdomen, setAbdomen] = useState("");
  const [supraIliaca, setSupraIliaca] = useState("");
  const [coxa, setCoxa] = useState("");
  const [resultados, setResultados] = useState(null);

  const validarCampos = () => {
    if (
      !peso ||
      !altura ||
      !peitoral ||
      !axilarMedia ||
      !triceps ||
      !subescapular ||
      !abdomen ||
      !supraIliaca ||
      !coxa
    ) {
      alert("Todos os campos são obrigatórios.");
      return false;
    }
    return true;
  };

  const calcularResultados = () => {
    if (!validarCampos()) return;

    const pesoKg = parseFloat(peso);
    const alturaM = parseFloat(altura) / 100;
    const idadeNum = parseFloat(idade);
    const peitoralNum = parseFloat(peitoral);
    const axilarMediaNum = parseFloat(axilarMedia);
    const tricepsNum = parseFloat(triceps);
    const subescapularNum = parseFloat(subescapular);
    const abdomenNum = parseFloat(abdomen);
    const supraIliacaNum = parseFloat(supraIliaca);
    const coxaNum = parseFloat(coxa);

    const S = peitoralNum + axilarMediaNum + tricepsNum + subescapularNum + abdomenNum + supraIliacaNum + coxaNum;
    const densidadeCorporal = 1.097 - 0.00046971 * S + 0.00000056 * S ** 2 - 0.00012828 * idadeNum;
    const percentualGordura = 495 / densidadeCorporal - 450;
    const percentualMassaMagra = 100 - percentualGordura;
    const massaGorduraKg = (percentualGordura / 100) * pesoKg;
    const massaMagraKg = pesoKg - massaGorduraKg;
    const imc = pesoKg / (alturaM * alturaM);

    let classificacaoIMC = "";
    if (imc < 18.5) {
      classificacaoIMC = "Abaixo do peso";
    } else if (imc >= 18.5 && imc < 24.9) {
      classificacaoIMC = "Peso normal";
    } else if (imc >= 25 && imc < 29.9) {
      classificacaoIMC = "Sobrepeso";
    } else {
      classificacaoIMC = "Obesidade";
    }

    setResultados({
      percentualGordura: percentualGordura.toFixed(2),
      percentualMassaMagra: percentualMassaMagra.toFixed(2),
      massaGorduraKg: massaGorduraKg.toFixed(2),
      massaMagraKg: massaMagraKg.toFixed(2),
      imc: imc.toFixed(2),
      classificacaoIMC,
    });
  };

  const salvarAvaliacao = async () => {
    if (!resultados) {
      alert("Por favor, calcule os resultados antes de salvar.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/avaliacao-masculina", {
        aluno_id: alunoId,
        nome,
        idade,
        peso,
        altura,
        peitoral,
        axilar_media: axilarMedia,
        triceps,
        subescapular,
        abdomen,
        supra_iliaca: supraIliaca,
        coxa,
        percentual_gordura: resultados.percentualGordura,
        percentual_massa_magra: resultados.percentualMassaMagra,
        massa_gordura_kg: resultados.massaGorduraKg,
        massa_magra_kg: resultados.massaMagraKg,
        imc: resultados.imc,
        classificacao_imc: resultados.classificacaoIMC,
      });

      alert(response.data.message);
      navigate("/avaliacoes");
    } catch (error) {
      alert("Erro ao salvar avaliação: " + (error.response?.data?.error || "Erro desconhecido"));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Avaliação Masculina</h2>
      <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
        {[
          { label: "Nome", value: nome, setValue: setNome, disabled: true },
          { label: "Idade", value: idade, setValue: setIdade, disabled: true },
          { label: "Peso (kg)", value: peso, setValue: setPeso },
          { label: "Altura (cm)", value: altura, setValue: setAltura },
          { label: "Peitoral (mm)", value: peitoral, setValue: setPeitoral },
          { label: "Axilar Média (mm)", value: axilarMedia, setValue: setAxilarMedia },
          { label: "Tríceps (mm)", value: triceps, setValue: setTriceps },
          { label: "Subescapular (mm)", value: subescapular, setValue: setSubescapular },
          { label: "Abdômen (mm)", value: abdomen, setValue: setAbdomen },
          { label: "Supra-ilíaca (mm)", value: supraIliaca, setValue: setSupraIliaca },
          { label: "Coxa (mm)", value: coxa, setValue: setCoxa },
        ].map(({ label, value, setValue, disabled }) => (
          <div key={label} style={styles.inputContainer}>
            <label style={styles.label}>{label}:</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              placeholder={`${label} - Campo obrigatório`}
              style={styles.input}
            />
          </div>
        ))}
        <button type="button" onClick={calcularResultados} style={styles.button}>
          Calcular
        </button>
        <button type="button" onClick={salvarAvaliacao} style={styles.button}>
          Salvar Avaliação
        </button>
      </form>
      {resultados && (
        <div style={styles.results}>
          <h3 style={styles.resultsTitle}>Resultados:</h3>
          <p><strong>Percentual de Gordura:</strong> {resultados.percentualGordura}%</p>
          <p><strong>Percentual de Massa Magra:</strong> {resultados.percentualMassaMagra}%</p>
          <p><strong>Massa de Gordura (kg):</strong> {resultados.massaGorduraKg} kg</p>
          <p><strong>Massa Magra (kg):</strong> {resultados.massaMagraKg} kg</p>
          <p><strong>IMC:</strong> {resultados.imc}</p>
          <p><strong>Classificação IMC:</strong> {resultados.classificacaoIMC}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "850px",
    margin: "20px auto",
    padding: "30px",
    backgroundColor: "#f7f9fc",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#4ecdc4",
    fontSize: "26px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputContainer: {
    marginBottom: "20px",
  },
  label: {
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    padding: "14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#4ecdc4",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "16px",
  },
  results: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
  },
  resultsTitle: {
    fontSize: "20px",
    color: "#4ecdc4",
    marginBottom: "10px",
  },
};

export default AvaliacaoMasculina;
