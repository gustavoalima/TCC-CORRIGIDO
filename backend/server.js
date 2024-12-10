const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const csvWriter = require("csv-writer").createObjectCsvWriter;
const csvParser = require("csv-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Inclua 'DELETE' aqui
  allowedHeaders: ['Content-Type'],
}));

app.use(fileUpload());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});

// Criação das tabelas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cep TEXT NOT NULL,
      endereco TEXT NOT NULL,
      data_nascimento TEXT NOT NULL,
      idade INTEGER NOT NULL,
      sexo TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS avaliacoes_femininas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      idade INTEGER NOT NULL,
      peso REAL NOT NULL,
      altura REAL NOT NULL,
      peitoral REAL NOT NULL,
      axilar_media REAL NOT NULL,
      triceps REAL NOT NULL,
      subescapular REAL NOT NULL,
      abdomen REAL NOT NULL,
      supra_iliaca REAL NOT NULL,
      coxa REAL NOT NULL,
      percentual_gordura REAL NOT NULL,
      percentual_massa_magra REAL NOT NULL,
      massa_gordura_kg REAL NOT NULL,
      massa_magra_kg REAL NOT NULL,
      imc REAL NOT NULL,
      classificacao_imc TEXT NOT NULL,
      data_avaliacao TEXT NOT NULL,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS avaliacoes_masculinas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      idade INTEGER NOT NULL,
      peso REAL NOT NULL,
      altura REAL NOT NULL,
      peitoral REAL NOT NULL,
      axilar_media REAL NOT NULL,
      triceps REAL NOT NULL,
      subescapular REAL NOT NULL,
      abdomen REAL NOT NULL,
      supra_iliaca REAL NOT NULL,
      coxa REAL NOT NULL,
      percentual_gordura REAL NOT NULL,
      percentual_massa_magra REAL NOT NULL,
      massa_gordura_kg REAL NOT NULL,
      massa_magra_kg REAL NOT NULL,
      imc REAL NOT NULL,
      classificacao_imc TEXT NOT NULL,
      data_avaliacao TEXT NOT NULL,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    )
  `);
});

// Endpoints de usuários
app.post("/usuarios", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `INSERT INTO usuarios (username, password) VALUES (?, ?)`;
  db.run(sql, [username, password], function (err) {
    if (err) {
      console.error("Erro ao registrar usuário:", err.message);
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, username });
  });
});

// Login de usuário
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      console.error("Erro ao realizar login:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.status(200).json({ success: true, message: "Login bem-sucedido." });
    } else {
      res.status(401).json({ success: false, message: "Credenciais inválidas." });
    }
  });
});

// Endpoints de alunos
app.post("/alunos", (req, res) => {
  const { nome, cep, endereco, data_nascimento, idade, sexo } = req.body;

  if (!nome || !cep || !endereco || !data_nascimento || !idade || !sexo) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `INSERT INTO alunos (nome, cep, endereco, data_nascimento, idade, sexo) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [nome, cep, endereco, data_nascimento, idade, sexo], function (err) {
    if (err) {
      console.error("Erro ao registrar aluno:", err.message);
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, nome });
  });
});

app.get("/alunos", (req, res) => {
  db.all("SELECT * FROM alunos", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar alunos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar alunos." });
    }
    res.json(rows);
  });
});

app.put("/alunos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cep, endereco, data_nascimento, idade, sexo } = req.body;

  if (!nome || !cep || !endereco || !data_nascimento || !idade || !sexo) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `
    UPDATE alunos 
    SET nome = ?, cep = ?, endereco = ?, data_nascimento = ?, idade = ?, sexo = ? 
    WHERE id = ?
  `;

  db.run(sql, [nome, cep, endereco, data_nascimento, idade, sexo, id], function (err) {
    if (err) {
      console.error("Erro ao atualizar aluno:", err.message);
      return res.status(500).json({ error: "Erro ao atualizar aluno." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    res.status(200).json({ message: "Aluno atualizado com sucesso!" });
  });
});

// 🔥 Novo endpoint para deletar aluno 🔥
app.delete("/alunos/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do aluno não fornecido." });
  }

  const sql = `DELETE FROM alunos WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Erro ao excluir aluno:", err.message);
      return res.status(500).json({ error: "Erro ao excluir aluno." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    res.status(200).json({ message: "Aluno excluído com sucesso!" });
  });
});


// Endpoint para apagar uma avaliação
app.delete("/avaliacoes/:id", (req, res) => {
  const { id } = req.params;

  const sqlFeminina = `DELETE FROM avaliacoes_femininas WHERE id = ?`;
  const sqlMasculina = `DELETE FROM avaliacoes_masculinas WHERE id = ?`;

  // Tentamos excluir da tabela de avaliações femininas
  db.run(sqlFeminina, [id], function (err) {
    if (err) {
      console.error("Erro ao apagar avaliação feminina:", err.message);
      return res.status(500).json({ error: "Erro ao apagar avaliação feminina." });
    }

    // Se nenhuma linha foi afetada, tentamos excluir da tabela de avaliações masculinas
    if (this.changes === 0) {
      db.run(sqlMasculina, [id], function (err) {
        if (err) {
          console.error("Erro ao apagar avaliação masculina:", err.message);
          return res.status(500).json({ error: "Erro ao apagar avaliação masculina." });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: "Avaliação não encontrada." });
        }

        res.status(200).json({ message: "Avaliação masculina apagada com sucesso." });
      });
    } else {
      res.status(200).json({ message: "Avaliação feminina apagada com sucesso." });
    }
  });
});
 
// Endpoints de avaliações
app.post("/avaliacao-feminina", (req, res) => {
  const {
    aluno_id,
    nome,
    idade,
    peso,
    altura,
    peitoral,
    axilar_media,
    triceps,
    subescapular,
    abdomen,
    supra_iliaca,
    coxa,
    percentual_gordura,
    percentual_massa_magra,
    massa_gordura_kg,
    massa_magra_kg,
    imc,
    classificacao_imc,
  } = req.body;

  const data_avaliacao = new Date().toISOString();

  const sql = `INSERT INTO avaliacoes_femininas (
    aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps,
    subescapular, abdomen, supra_iliaca, coxa, percentual_gordura,
    percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc, data_avaliacao
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [
      aluno_id,
      nome,
      idade,
      peso,
      altura,
      peitoral,
      axilar_media,
      triceps,
      subescapular,
      abdomen,
      supra_iliaca,
      coxa,
      percentual_gordura,
      percentual_massa_magra,
      massa_gordura_kg,
      massa_magra_kg,
      imc,
      classificacao_imc,
      data_avaliacao,
    ],
    function (err) {
      if (err) {
        console.error("Erro ao salvar avaliação feminina:", err.message);
        return res.status(500).json({ error: "Erro ao salvar avaliação feminina." });
      }
      res.status(201).json({ message: "Avaliação feminina salva com sucesso!" });
    }
  );
});

app.post("/avaliacao-masculina", (req, res) => {
  const {
    aluno_id,
    nome,
    idade,
    peso,
    altura,
    peitoral,
    axilar_media,
    triceps,
    subescapular,
    abdomen,
    supra_iliaca,
    coxa,
    percentual_gordura,
    percentual_massa_magra,
    massa_gordura_kg,
    massa_magra_kg,
    imc,
    classificacao_imc,
  } = req.body;

  const data_avaliacao = new Date().toISOString();

  const sql = `INSERT INTO avaliacoes_masculinas (
    aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps,
    subescapular, abdomen, supra_iliaca, coxa, percentual_gordura,
    percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc, data_avaliacao
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [
      aluno_id,
      nome,
      idade,
      peso,
      altura,
      peitoral,
      axilar_media,
      triceps,
      subescapular,
      abdomen,
      supra_iliaca,
      coxa,
      percentual_gordura,
      percentual_massa_magra,
      massa_gordura_kg,
      massa_magra_kg,
      imc,
      classificacao_imc,
      data_avaliacao,
    ],
    function (err) {
      if (err) {
        console.error("Erro ao salvar avaliação masculina:", err.message);
        return res.status(500).json({ error: "Erro ao salvar avaliação masculina." });
      }
      res.status(201).json({ message: "Avaliação masculina salva com sucesso!" });
    }
  );
});

app.get("/avaliacoes/:alunoId", (req, res) => {
  const { alunoId } = req.params;

  const sql = `
    SELECT * FROM avaliacoes_femininas WHERE aluno_id = ?
    UNION ALL
    SELECT * FROM avaliacoes_masculinas WHERE aluno_id = ?
    ORDER BY data_avaliacao DESC
  `;

  db.all(sql, [alunoId, alunoId], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar avaliações:", err.message);
      return res.status(500).json({ error: "Erro ao buscar avaliações." });
    }
    res.json(rows);
  });
});

// Endpoint para backup
// Endpoint para backup
app.get("/api/backup", async (req, res) => {
  const filePath = "./backup.csv";
  const tables = ["usuarios", "alunos", "avaliacoes_femininas", "avaliacoes_masculinas"];
  const data = [];

  try {
    for (const table of tables) {
      const rows = await new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });

      if (!rows || rows.length === 0) {
        console.warn(`Tabela ${table} está vazia ou não contém dados válidos.`);
        continue; // Ignorar tabelas sem dados
      }

      rows.forEach((row) => {
        // Verificação de integridade do objeto
        if (!row || Object.keys(row).length === 0) {
          console.warn(`Tabela ${table} contém uma linha inválida:`, row);
          return;
        }
        data.push({ table, data: JSON.stringify(row) });
      });
    }

    if (data.length === 0) {
      console.error("Nenhuma tabela válida foi encontrada para backup.");
      return res.status(400).send("Nenhuma tabela contém dados para backup.");
    }

    const writer = csvWriter({
      path: filePath,
      header: [
        { id: "table", title: "Table" },
        { id: "data", title: "Data" },
      ],
    });

    await writer.writeRecords(data);

    res.download(filePath, "backup.csv", (err) => {
      if (err) {
        console.error("Erro ao realizar o backup:", err);
        res.status(500).send("Erro ao realizar o backup.");
      }
      fs.unlinkSync(filePath); // Limpa o arquivo após o envio
    });
  } catch (error) {
    console.error("Erro ao processar o backup:", error);
    res.status(500).send("Erro ao processar o backup.");
  }
});
app.get("/avaliacoes/:alunoId", (req, res) => {
  const { alunoId } = req.params;
  const sql = `
    SELECT * FROM avaliacoes_femininas WHERE aluno_id = ?
    UNION ALL
    SELECT * FROM avaliacoes_masculinas WHERE aluno_id = ?
    ORDER BY data_avaliacao DESC
  `;

  db.all(sql, [alunoId, alunoId], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar avaliações:", err.message);
      return res.status(500).json({ error: "Erro ao buscar avaliações." });
    }
    res.json(rows); // Retorna as avaliações para o front-end
  });
});
app.get("/alunos", (req, res) => {
  db.all("SELECT * FROM alunos", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar alunos:", err.message);
      return res.status(500).json({ error: "Erro ao buscar alunos." });
    }
    res.json(rows); // Certifique-se de que o nome e a idade estão sendo retornados
  });
});


// Endpoint para restaurar backup
app.post("/api/restore", (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("Nenhum arquivo enviado.");
  }

  const uploadedFile = req.files.file;
  const filePath = "./restore.csv";

  uploadedFile.mv(filePath, async (err) => {
    if (err) {
      console.error("Erro ao salvar o arquivo:", err);
      return res.status(500).send("Erro ao salvar o arquivo.");
    }

    try {
      const operations = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          try {
            const table = row.Table; // Consistente com o backup gerado
            const data = JSON.parse(row.Data); // Valida o JSON armazenado

            if (!table || !data || typeof data !== "object") {
              throw new Error("Linha do CSV está incompleta ou inválida.");
            }

            const columns = Object.keys(data);
            const values = Object.values(data);

            const placeholders = columns.map(() => "?").join(", ");
            const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

            operations.push(
              new Promise((resolve, reject) => {
                db.run(sql, values, (err) => {
                  if (err) {
                    console.error(`Erro ao restaurar dados na tabela ${table}:`, err.message);
                    return reject(err);
                  }
                  resolve();
                });
              })
            );
          } catch (error) {
            console.error("Erro ao processar a linha do CSV:", row, error.message);
          }
        })
        .on("end", async () => {
          try {
            await Promise.all(operations);
            fs.unlinkSync(filePath); // Remove o arquivo após o uso
            res.send("Backup restaurado com sucesso!");
          } catch (error) {
            console.error("Erro ao executar operações de restauração:", error);
            res.status(500).send("Erro ao restaurar os dados.");
          }
        })
        .on("error", (error) => {
          console.error("Erro ao ler o arquivo CSV:", error);
          res.status(500).send("Erro ao processar o arquivo de restauração.");
        });
    } catch (error) {
      console.error("Erro ao restaurar o backup:", error);
      res.status(500).send("Erro ao restaurar o backup.");
    }
  });
});


        

// Inicializar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
