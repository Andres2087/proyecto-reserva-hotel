#CONEXIÓN A LA BASE DE DATOS
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


RUTABASEDATOS="mysql+mysqlconnector://root:@localhost:3306/proyecto_reservashoteles"

engine=create_engine(RUTABASEDATOS)

try:
    with engine.connect() as connection:
        print("Conexión exitosa")
except Exception as e:
    print(f"Error al conectar: {e}")

SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base=declarative_base()



