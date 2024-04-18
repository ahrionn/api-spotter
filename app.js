require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DIALECT,
  dialectOptions: process.env.DB_OPTIONS
});

app.get('/api/listaEstoque', async (req, res) => {
  try {
    const itensEstoque = await sequelize.query('select * from "itens"');
    res.status(200).json(itensEstoque[0]);
  } catch (error) {
    console.error('Erro ao buscar itens do estoque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/listaCompras', (req, res) => {
  const dadosRecebidos = req.body;
  console.log(dadosRecebidos);
  res.status(200).json({ message: 'Dados recebidos com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
