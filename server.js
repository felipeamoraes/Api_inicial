// Instale dependências:
// npm init -y
// npm install express body-parser

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// "Banco de dados" em memória
let usuarios = [];

// Função para formatar data para YYYY-MM-DD
function formatarData(dataStr) {
  if (!dataStr) return null;
  try {
    // Tenta parsear diferentes formatos
    let data;
    if (dataStr.includes('/')) {
      // Formato DD/MM/YYYY
      const partes = dataStr.split('/');
      data = new Date(partes[2], partes[1] - 1, partes[0]);
    } else if (dataStr.includes('-')) {
      // Já está em YYYY-MM-DD ou similar
      data = new Date(dataStr);
    } else {
      data = new Date(dataStr);
    }
    if (isNaN(data.getTime())) return dataStr; // Retorna original se inválida
    return data.toISOString().split('T')[0];
  } catch (error) {
    return dataStr;
  }
}

// Formatar datas existentes ao iniciar
usuarios = usuarios.map(u => ({
  ...u,
  dataNascimento: formatarData(u.dataNascimento)
}));

// Rota para cadastrar usuário
app.post("/usuarios", (req, res) => {
  const { nome, cpf, email, dataNascimento } = req.body;

  // Validações simples
  if (!nome || !cpf || !email || !dataNascimento) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  // Formatar data de nascimento para formato SQL Server (YYYY-MM-DD)
  const dataFormatada = formatarData(dataNascimento);
  if (!dataFormatada) {
    return res.status(400).json({ erro: "Data de nascimento inválida" });
  }

  // Verifica se CPF já existe
  const existe = usuarios.find((u) => u.cpf === cpf);
  if (existe) {
    return res.status(400).json({ erro: "CPF já cadastrado" });
  }

  const novoUsuario = { nome, cpf, email, dataNascimento: dataFormatada };
  usuarios.push(novoUsuario);

  res.status(201).json(novoUsuario);
});

// Rota para listar usuários
app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

app.get("/health", (req, res) => {
  res.send("API está rodando 🚀");
});

// Inicia servidor
const PORT = process.env.PORT || 3000; // usa a porta do Render
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});



