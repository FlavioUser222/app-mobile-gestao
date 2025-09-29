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
    const { nome, data, email, telefone, usuario_id } = req.body

    try {
        const result = await pool.query(
            'INSERT INTO clientes (nome, data,email,telefone,usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, data, email, telefone, usuario_id]
        )
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})

app.get('/clientes-vendas', async (req, res) => {
    const { usuario_id } = req.query

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
             WHERE c.usuario_id = $1
            GROUP BY c.id, c.nome, c.email, c.telefone
            ORDER BY c.nome
        `, [usuario_id]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
});


app.get('/clientes', async (req, res) => {
    const { usuario_id } = req.query

    try {
        const result = await pool.query(
            'SELECT * FROM clientes WHERE usuario_id = $1',
            [usuario_id]
        )
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server')
    }
})

app.post('/venda', async (req, res) => {
    const { cliente_id, quantidadeVendas, data, valor, usuario_id, nome_produto, foipaga } = req.body

    try {
        const result = await pool.query(
            'INSERT INTO vendas (cliente_id, quantidadeVendas, data,valor,usuario_id,nome_produto,foipaga) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *',
            [cliente_id, quantidadeVendas, data, valor, usuario_id, nome_produto, foipaga]
        )

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})


app.get('/vendas', async (req, res) => {
    const { usuario_id } = req.query
    try {
        const result = await pool.query(
            `SELECT * FROM vendas WHERE usuario_id = $1`, [usuario_id]
        )
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server')
    }
})


app.post('/despesa', async (req, res) => {
    const { nome, valor, data, usuario_id } = req.body

    try {
        const result = await pool.query(
            'INSERT INTO despesas (nome, valor, data,usuario_id) VALUES ($1, $2, $3,$4) RETURNING *',
            [nome, valor, data, usuario_id]
        )
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})


app.get('/despesas', async (req, res) => {
    const { usuario_id } = req.query
    try {
        const result = await pool.query(
            'SELECT * FROM despesas WHERE usuario_id = $1', [usuario_id]
        )
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server')
    }
})


app.delete('/venda/:id', async (req, res) => {
    const { id } = req.params
    const { usuario_id } = req.query

    try {
        const result = await pool.query(
            'DELETE FROM vendas WHERE id = $1  AND usuario_id = $2 RETURNING *',
            [id, usuario_id]
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
    const { usuario_id } = req.query

    try {
        const result = await pool.query(
            'DELETE FROM despesas WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [id, usuario_id]
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
    const { usuario_id } = req.query
    try {
        const result = await pool.query(
            'DELETE FROM clientes WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [id, usuario_id]
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
    const { usuario_id } = req.query
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(valor), 0) AS faturamento_total
            FROM vendas 
            WHERE usuario_id = $1
`, [usuario_id]);

        res.status(200).json({ faturamento: result.rows[0].faturamento_total });
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro no server');
    }
})

app.get('/despesas-totais', async (req, res) => {

    const { usuario_id } = req.query

    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(valor), 0) AS despesas_totais
            FROM despesas
            WHERE usuario_id = $1
        `, [usuario_id]);

        res.status(200).json({ despesas: result.rows[0].despesas_totais });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor ao calcular despesas.' });
    }
})


app.get('/lucro', async (req, res) => {
    const { usuario_id } = req.query

    try {
        const result = await pool.query(`
            SELECT 
               COALESCE((SELECT SUM(valor) FROM vendas WHERE usuario_id = $1), 0) -
               COALESCE((SELECT SUM(valor) FROM despesas WHERE usuario_id = $1), 0) AS lucro
        `, [usuario_id]);

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


app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado' })
        }

        const user = result.rows[0];
        if (user.senha !== senha) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }

        res.status(200).json({ mensagem: 'Login bem-sucedido', usuario: user })

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro interno do servidor' })
    }
});



app.get('/ultimas-movimentacoes', async (req, res) => {
    const { usuario_id } = req.query


    try {
        const vendasRes = await pool.query('SELECT nome_produto AS descricao,valor,data FROM vendas WHERE usuario_id = $1 ORDER BY data DESC LIMIT 5', [usuario_id])

        const vendas = vendasRes.rows.map(venda => ({
            tipo: 'venda',
            descricao: venda.descricao,
            valor: venda.valor,
            data: venda.data
        }));

        const despesasRes = await pool.query(`
            SELECT nome AS descricao, valor, data
            FROM despesas
            WHERE usuario_id = $1
            ORDER BY data DESC
            LIMIT 5
    `, [usuario_id]);

        const despesas = despesasRes.rows.map(despesa => ({
            tipo: 'despesa',
            descricao: despesa.descricao,
            valor: despesa.valor,
            data: despesa.data
        }));

        const movimentacoes = [...vendas, ...despesas].sort((a, b) => new Date(b.data) - new Date(a.data));
        res.status(200).json(movimentacoes)

    } catch (error) {
        console.error('Erro ao buscar movimentacoes', error)
        res.status(500).json({ erro: 'Erro interno no servidor' });

    }
})


app.post('/produto', async (req, res) => {
    const { nome, preco, estoque, usuario_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO produtoservicos (nome, preco, estoque, usuario_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nome, preco, estoque, usuario_id]
        )
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao cadastrar produto' });
    }
})

app.get('/produtos', async (req, res) => {
    const { usuario_id } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM produtoservicos WHERE usuario_id = $1 ORDER BY nome',
            [usuario_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
})

app.post('/venda-com-itens', async (req, res) => {
    const { cliente_id, data, valor_total, usuario_id, foipaga, itens } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const vendaResult = await client.query(
            `INSERT INTO vendas (cliente_id, data, valor, usuario_id, foipaga) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [cliente_id, data, valor_total, usuario_id, foipaga]
        );

        const venda_id = vendaResult.rows[0].id;

        for (const item of itens) {
            const { produto_id, quantidade, preco_unitario } = item;

            await client.query(
                `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario)
                 VALUES ($1, $2, $3, $4)`,
                [venda_id, produto_id, quantidade, preco_unitario]
            );

            await client.query(
                `UPDATE produtos SET estoque = estoque - $1 WHERE id = $2`,
                [quantidade, produto_id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ mensagem: 'Venda registrada com sucesso', venda_id });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ erro: 'Erro ao registrar venda com itens' });
    } finally {
        client.release();
    }
});






app.listen(port, () => {
    console.log('App rodando na porta 3000')
})

