require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true'
      ? {
          require: true,
          rejectUnauthorized: false
        }
      : null
  }
});

const Item = sequelize.define('Item', 
  {
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    corredor: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    preco: {
      type: Sequelize.FLOAT,
      allowNull: false,
    }
  },
  { 
    tableName: 'itens',
    timestamps: false
  }
);

app.post('/api/addItem', async (req, res) => {
  const { nome, corredor, price } = req.body;

  try {
    const novoProduto = await Item.create({
      nome: nome,
      corredor: corredor,
      preco: price,
    });
    
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).send('Erro ao inserir produto: ' + error.message);
  }
});

app.put('/api/updateItem', async (req, res) => {
  const { id, nome, corredor, price } = req.body;

  try {
    const [rowsUpdated] = await Item.update(
      { nome, corredor, preco: price },
      { where: { id } }
    );

    if (rowsUpdated > 0) {
      res.status(200).json({ message: 'Produto atualizado com sucesso.' });
    } else {
      res.status(404).json({ error: 'Produto não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar produto: ${error.message}` });
  }
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

app.get('/api/buscaDadosItem', async (req, res) => {
  try {
    const itensEstoque = await sequelize.query('select * from "itens" where "nome" = ' + "'" + req.query.nome + "'");
    res.status(200).json(itensEstoque[0]);
  } catch (error) {
    console.error('Erro ao buscar item', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = sequelize;