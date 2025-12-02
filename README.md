# Estoque OOP JS

Projeto exemplo: backend em Node.js orientado a objetos + frontend simples.

## Rodando localmente

1. Configure o PostgreSQL:
   - Crie o DB `estoque`
   - Rode o script:
     CREATE TABLE produtos (
       id SERIAL PRIMARY KEY,
       nome VARCHAR(100) NOT NULL,
       quantidade INTEGER NOT NULL
     );

2. Instale dependências:
   npm install

3. Defina variáveis de ambiente (opcional) ou edite db.js:
   PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT

4. Inicie o servidor:
   npm start

5. Abra `frontend/index.html` no navegador para testar.
