import os
import pandas as pd
import random
from faker import Faker
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "root")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "estoque")
DB_PORT = os.getenv("DB_PORT", "5432")


CONN_STRING = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


def init_db(engine):

    print("Resetando a tabela 'produtos'")
    with engine.connect() as conn:
        # Começa uma transação
        conn.execute(text("DROP TABLE IF EXISTS produtos;"))
        conn.execute(text("""
            CREATE TABLE produtos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                quantidade INTEGER NOT NULL,
                categoria VARCHAR(50),
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """))
        conn.commit()
    print("Schema criado com sucesso.")


def generate_data(n_rows=100):
    """
    Gera dados falsos e retorna um DataFrame do Pandas.
    """
    print(f"Gerando {n_rows} linhas de dados no Pandas...")
    fake = Faker('pt_BR')
    
    # Listas auxiliares para dar realismo
    categorias = ['Periféricos', 'Hardware', 'Monitores', 'Cadeiras', 'Notebooks']
    marcas = ['Logitech', 'Dell', 'Redragon', 'Corsair', 'Kingston', 'Samsung']
    produtos_base = ['Mouse', 'Teclado', 'Headset', 'Monitor', 'SSD', 'Memória RAM', 'Gabinete']

    data = []
    for _ in range(n_rows):
        produto_nome = f"{random.choice(produtos_base)} {fake.word().capitalize()} {random.choice(marcas)}"
        
        row = {
            'nome': produto_nome,
            'quantidade': random.randint(0, 200),
            'categoria': random.choice(categorias)
        }
        data.append(row)

    # Cria o DataFrame
    df = pd.DataFrame(data)
    return df


def load_to_postgres(df, engine):
    """
    Carrega o DataFrame para o Banco de Dados.
    """
    print("Carregando dados para o PostgreSQL...")
    
    df.to_sql('produtos', con=engine, if_exists='append', index=False)
    
    print(f"🚀 Sucesso! {len(df)} registros inseridos.")


if __name__ == "__main__":
    try:

        engine = create_engine(CONN_STRING)
        
        init_db(engine)

        df_produtos = generate_data(n_rows=50)

        print("\n--- Preview dos Dados (Top 5) ---")
        print(df_produtos.head())
        print("---------------------------------\n")

        load_to_postgres(df_produtos, engine)

    except Exception as e:
        print(f"Deu erro: {e}")