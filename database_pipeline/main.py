import os
import pandas as pd
import random
import pytz
from datetime import datetime
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

TABELAS = [
    "usuarios",
    "produtos"
]

DROP_QUERY = "DROP TABLE IF EXISTS {tabela_nome};"

DDL_QUERIES = {
    "produtos": """
        CREATE TABLE produtos (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            quantidade INTEGER NOT NULL,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """,
    "usuarios": """
        CREATE TABLE usuarios (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            senha VARCHAR(100) NOT NULL
        );
    """
}


def get_engine():
    return create_engine(CONN_STRING)


def preparar_banco(engine, tabela: str):
    print(f"[DDL] Preparando tabela: {tabela}")
    with engine.connect() as conn:
        conn.execute(text(DROP_QUERY.format(tabela_nome=tabela)))
        conn.execute(text(DDL_QUERIES[tabela]))
        conn.commit()


def gerar_dataframe(tabela: str, n_rows=50) -> pd.DataFrame:
    fake = Faker('pt_BR')
    fuso_brasil = pytz.timezone('America/Sao_Paulo')
    data = []

    if tabela == "produtos":
        print(f"[Generate] Gerando {n_rows} produtos fictícios...")
        marcas = [
            'Logitech',
            'Dell',
            'Redragon',
            'Corsair',
            'Kingston',
            'Samsung'
            ]

        produtos_base = [
            'Mouse',
            'Teclado',
            'Headset',
            'Monitor',
            'SSD',
            'Memória RAM'
            ]

        for _ in range(n_rows):
            produto_nome = f"{random.choice(produtos_base)} {fake.word().capitalize()} {random.choice(marcas)}"
            hora = datetime.now(fuso_brasil).replace(tzinfo=None)
            row = {
                'nome': produto_nome,
                'quantidade': random.randint(1, 200),
                'data_cadastro': hora
            }
            data.append(row)

    elif tabela == "usuarios":
        print(f"[Generate] Tabela 'usuarios' criada.")
        return pd.DataFrame()

    return pd.DataFrame(data)


def carregar_dados(engine, tabela: str, df: pd.DataFrame):

    if df.empty:
        print(f"[Load] Tabela '{tabela}' está vazia. Nenhuma carga realizada.")
        return

    print(f"[Load] Inserindo {len(df)} linhas em '{tabela}'...")
    df.to_sql(
        name=tabela,
        con=engine,
        if_exists='append',
        index=False
    )


def run_pipeline():
    try:
        engine = get_engine()
        for tabela in TABELAS:
            print(f"\n--- Processando: {tabela.upper()} ---")

            preparar_banco(engine, tabela)

            df = gerar_dataframe(tabela, n_rows=50)

            carregar_dados(engine, tabela, df)

        print("\nPipeline finalizado com sucesso!")

    except Exception as e:
        print(f"Erro fatal no pipeline: {e}")


if __name__ == "__main__":
    run_pipeline()