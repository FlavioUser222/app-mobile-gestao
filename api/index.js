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
    const { nome, data, email, telefone } = req.body

    try {
        const result = await pool.query(
            'INSERT INTO clientes (nome, data,email,telefone) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, data, email, telefone]
        )
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})

app.get('/clientes-vendas', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id,
                c.nome,
                c.email,
                c.telefone,
                COALESCE(SUM(v.quantidadeVendas), 0) AS totalVendas
            FROM clientes c
            LEFT JOIN vendas v ON v.cliente_id = c.id
            GROUP BY c.id, c.nome, c.email, c.telefone
            ORDER BY c.nome
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
});


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
            `SELECT * FROM vendas`
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


app.delete('/venda/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            'DELETE FROM vendas WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Venda não encontrada' });
        }

        res.status(200).json({ mensagem: 'Venda deletada com sucesso', venda: result.rows[0] });

    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar venda" })
    }
})

app.delete('/despesa/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            'DELETE FROM despesas WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Despesa não encontrada' });
        }

        res.status(200).json({ mensagem: 'Despesa deletada com sucesso', venda: result.rows[0] });

    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar despesa" })
    }
})

app.delete('/cliente/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            'DELETE FROM cliente WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        res.status(200).json({ mensagem: 'Cliente deletado com sucesso', venda: result.rows[0] });

    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar cliente" })
    }
})

app.get('/faturamentoTotal', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(valor), 0) AS faturamento_total
            FROM vendas 
        `);

        res.status(200).json({ faturamento: result.rows[0].faturamento_total });
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})

app.get('/despesas-totais', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(valor), 0) AS despesas_totais
            FROM despesas
        `);

        res.status(200).json({ despesas: result.rows[0].despesas_totais });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor ao calcular despesas.' });
    }
})


app.get('/lucro', async (req, res) => {

    try {
        const result = await pool.query(`
            SELECT 
                COALESCE((SELECT SUM(valor) FROM vendas), 0) -
                COALESCE((SELECT SUM(valor) FROM despesas), 0) AS lucro
        `);

        res.status(200).json({ lucro: result.rows[0].lucro });

    } catch (error) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor ao calcular lucro.' });
    }

})

app.post('/cadastrarUser', async (req, res) => {

    const { email, senha } = req.body
    try {
        const result = await pool.query(`
            INSERT INTO usuario(email,senha) VALUES ($1,$2) RETURNING * ` , [email, senha])
        res.status(201).json(result.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro em cadastrar user' })
    }
})



app.get('/users', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM usuario`)
        res.status(201).json(result.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro em cadastrar user' })
    }
})








app.listen(port, () => {
    console.log('App rodando na porta 3000')
})

