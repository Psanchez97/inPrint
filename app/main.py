from sqlalchemy.orm import Session
from global_utils import get_db, get_current_user
from user_creation import  get_user_by_email, create_user, authenticate_user, create_token
from fastapi.middleware.cors import CORSMiddleware
from fastapi import (
    FastAPI,
    HTTPException,
    Request,
    Depends,
    UploadFile,    
)
import schemas
import time
import fastapi.security as _security
import hashlib



app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/inicio")
def read_root():
    return {"message": "Hola, mundo"}

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    # Protege contra algunos tipos de ataque
    start_time = time.time()
    
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    response.headers[
        "Strict-Transport-Security"
    ] = "max-age=415569261; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"

    return response

@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # primero autentica y luego crea el token
    salt = "farm1990M0O"
    salt1 = "f1nd1ngn3m0"
    try:
        # Se crea una variable para formatear la contraseña con Salt
        # Se hashea la contraseña usando el algoritmo SHA-256.
        passwordSalt = salt1 + form_data.password + salt
        hashPassword = hashlib.sha256(passwordSalt.encode()).hexdigest()
        user = await authenticate_user(form_data.username, hashPassword, db)

        if not user:
            raise HTTPException(status_code=401, detail="Incorrect email or password")

        return await create_token(user)
    except:
        user = await authenticate_user(form_data.username, form_data.password, db)

        if not user:
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        return await create_token(user)
    
@app.post("/api/users")
async def create_user_m(
    user: schemas.UserCreate, db: Session = Depends(get_db), returnUser=False
):
    return await create_user(user, db, returnUser)

@app.get("/api/users/visitaWeb")
async def visista_web():
    return True

@app.get("/api/users/me", response_model=schemas.User)
async def get_user(user: schemas.User = Depends(get_current_user)):
    # Devuelve el usuario
    try:        
        return user
    except:
        raise HTTPException(status_code=404, detail="We couldn't find this user")
