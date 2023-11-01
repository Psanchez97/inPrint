from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine, engine
from decouple import config



#SQLALCHEMY_DATABASE_URL = "sqlite:///./trips.db"
try:
    SQLALCHEMY_DATABASE_URL = config('SQLALCHEMY_DATABASE_URL')
except:
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Sa17031997!@c9tvpvq0q0hw.eu-west-3.rds.amazonaws.com:5432/inprintdb"
# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL,connect_args={'check_same_thread': False}
# )
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()