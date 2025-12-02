const express = require('express');
const cors = require('cors');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/produtos', produtoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API OOP JS rodando na porta ${PORT}`));
