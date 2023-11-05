from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine, engine
from decouple import config



try:
    SQLALCHEMY_DATABASE_URL = config('SQLALCHEMY_DATABASE_URL')
except:
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Sa17031997!@inprintdb.c9tvpvq0q0hw.eu-west-3.rds.amazonaws.com"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()