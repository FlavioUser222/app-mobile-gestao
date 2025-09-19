const express = require('express')
const cors = require('cors')
require('dotenv').config();

const port = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(express.json())

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function testConnection() {
    const res = await pool.query('SELECT NOW()');
    console.log(res.rows[0]);
}

testConnection();


app.post('/cliente', async (req, res) => {
    const { nome,  data ,quantidadeVendas,email,telefone} = req.body

    try {
        const result = await pool.query(
            'INSERT INTO clientes (nome, data, quantidadeVendas,email,telefone) VALUES ($1, $2, $3,$4,$5) RETURNING *',
            [nome, data,quantidadeVendas,email,telefone]
        )
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})


app.get('/clientes', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM clientes'
        )
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server')
    }
})

app.post('/venda', async (req, res) => {
    const { cliente_id, quantidadeVendas, data, valor } = req.body

    try {
        const result = await pool.query(
            'INSERT INTO vendas (cliente_id, quantidadeVendas, data,valor) VALUES ($1, $2, $3, $4) RETURNING *',
            [cliente_id, quantidadeVendas, data, valor]
        )

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})


app.get('/vendas', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT v.*, c.nome AS cliente_nome 
             FROM vendas v 
             JOIN clientes c ON v.cliente_id = c.id`
        )
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server')
    }
})



app.post('/despesa', async (req, res) => {
    const { nome, valor, data } = req.body

    try {
        const result = await pool.query(
            'INSERT INTO despesas (nome, valor, data) VALUES ($1, $2, $3) RETURNING *',
            [nome, valor, data]
        )
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})


app.get('/despesas', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM despesas'
        )
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server')
    }
})






app.listen(port, () => {
    console.log('App rodando na porta 3000')
})

