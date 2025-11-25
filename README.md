# Sistema-Estoque

📦 Sistema Distribuído de Estoque

Documentação do projeto desenvolvido para demonstrar uma arquitetura distribuída utilizando Frontend (React), Backend (Node.js/Express) e Banco de Dados (PostgreSQL) totalmente separados.

🧩 Arquitetura do Sistema Distribuído

O sistema foi projetado seguindo o conceito de serviços independentes, onde cada parte roda em um ambiente diferente:

[Frontend React]  --->  [API Node/Express]  --->  [Banco PostgreSQL]


Cada componente pode ser hospedado em máquinas, servidores ou portas diferentes, caracterizando um sistema distribuído real.

1. 🎨 Frontend (React)

O frontend é responsável pela interface com o usuário.

Ele se comunica somente via HTTP com o backend usando fetch().

📌 Exemplo de chamada à API:
fetch("http://ENDERECO-DO-BACKEND:3000/produtos")
  .then(res => res.json())
  .then(data => console.log(data));

✔️ O frontend funciona totalmente independente do backend.

Basta apontar as rotas para o endereço correto da API.

2. ⚙️ Backend (Node.js + Express)

O backend expõe uma API REST para manipular o estoque.

Endpoints:
Método	Rota	Função
GET	/produtos	Lista todos os produtos
POST	/produtos	Cria um novo produto
PUT	/produtos/:id	Atualiza um produto
DELETE	/produtos/:id	Exclui um produto
🔌 Comunicação com o banco

O backend se conecta ao PostgreSQL usando o pacote pg.

Exemplo de configuração:

const pool = new Pool({
  user: 'postgres',
  host: 'HOST_DO_DB',
  database: 'estoque',
  password: 'SENHA',
  port: 5432,
});

🌐 CORS habilitado

Para permitir que o frontend rode em outro servidor/porta:

app.use(cors());

3. 🗄️ Banco de Dados (PostgreSQL)

O banco de dados foi containerizado para garantir a reprodutibilidade do ambiente e conta com um pipeline de dados automatizado.

O banco pode rodar em:
* **Docker (Recomendado para este projeto)**
* Serviços cloud (Railway, Render, Neon, Supabase)
* Máquina local ou Servidor remoto

Em vez de criar tabelas manualmente, o projeto utiliza um script Python (`database_pipeline/main.py`) que atua como **Infrastructure as Code (IaC)**.

**Funcionalidades do Pipeline:**
1.  **DDL Automatizado:** Recria a tabela `produtos` do zero (Idempotência).
2.  **Data Seeding:** Gera 100 registros realistas utilizando a lib `Faker`.
3.  **Data Quality:** Ajusta os timestamps para o fuso horário brasileiro (America/Sao_Paulo) antes da ingestão.

### 🚀 Como subir o Módulo de Dados
**1. Iniciar o Banco (Docker):**

```
docker run --name postgres-estoque -e POSTGRES_PASSWORD=root -e POSTGRES_DB=estoque -p 5432:5432 -d postgres
```
### 2. Executar Carga de Dados (Python):

```
cd database_pipeline
pip install -r requirements.txt
python main.py
```
### 📄 Schema da Tabela (Referência)
Caso queira consultar a estrutura criada pelo script Python:
```
SQL

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  quantidade INTEGER NOT NULL,
  categoria VARCHAR(50),
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. 🔗 Como Tudo se Conecta
4.1 Frontend → Backend

Via HTTP:

GET http://ip-ou-dominio-do-backend:3000/produtos

4.2 Backend → Banco

Via TCP:

postgres://user:senha@host:5432/estoque

4.3 Cada parte funciona mesmo estando separada fisicamente

Este é exatamente o objetivo de sistemas distribuídos.

5. 🚀 Como subir cada serviço separadamente
🖥️ FRONTEND
npm install
npm run dev


Aponte as URL do fetch para o backend.

⚙️ BACKEND
npm install
node server.js

🗄️ BD (local)

No PostgreSQL local, crie o banco:

CREATE DATABASE estoque;


Execute o script da tabela.
