const Sequelize = require('sequelize');
const database = require('../db');

const Item = database.define('item', {
    nome: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    corredor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = It