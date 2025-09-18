const express = require('express')
const cors = require('cors')

const port = 3000

const app = express()
app.use(cors())
app.use(express.json())



app.post('/vendas', async (req, res) => {
    const { cliente, valor, data } = req.body


})

app.listen(port, () => {
    console.log('App rodando na porta 3000')
})

