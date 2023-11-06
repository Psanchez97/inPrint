from fastapi import (
    HTTPException,
    Depends,
)
import models
from database import SessionLocal
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from decouple import config
import schemas


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # comprueba que el usuario sea el correcto
    try:
        JWT_SECRET = config("JWT_SECRET")
    except:
        print("Error, error, Error, raise UndefinedValueError, Traceback, exception, ERROR, ERROR: 500 Internal Server Error")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
        return schemas.Usuario.from_orm(user)
    except:
        raise HTTPException(status_code=401, detail="not authenticated")

