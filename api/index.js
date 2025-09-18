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


app.post('/vendas', async (req, res) => {
    const { cliente, valor, data } = req.body

    try {
        const result = await pool.query(
            'INSERT INTO vendas (cliente, valor, data) VALUES ($1, $2, $3) RETURNING *',
            [cliente, valor, data]
        )

    } catch (err) {
        console.error(err);
    }


})

app.listen(port, () => {
    console.log('App rodando na porta 3000')
})

