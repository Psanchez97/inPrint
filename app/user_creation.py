from warnings import filters
from fastapi import (
    HTTPException,
    Depends,
)
import models
from sqlalchemy.orm import Session
import schemas
from jose import jwt
import passlib.hash as _hash
from decouple import config
import datetime
from datetime import timedelta
from global_utils import get_db, get_current_user

JWT_SECRET = config("JWT_SECRET")


async def create_user(
    user: schemas.UserCreate, db: Session = Depends(get_db), returnUser=False
    ):
    # sirve para crear un usuario, se llama al crear una cuenta

    # try:
    # comprueba si ya existe un usuario con ese correo
    db_user = await get_user_by_email(user.email_usuario, db)

    if db_user:
        # si ya hay un usuario con ese correo, comprueba si la contraseña que han metido encaja con la que ya habían puesto
        # esto sirve porque a veces la gente se equivoca e intenta iniciar sesión en la sección de registrarse
        userOld = await authenticate_user(user.email_usuario, user.contrasena_usuario, db)

        if not userOld:
            # si no encaja, se le devuelve la excepción de que ya está registrado

            raise HTTPException(status_code=401, detail="Email ya registrado")

        # en caso de que no haya saltado la excepción, que detiene el código, se crea y se le devuelve el token
        return await create_token(userOld)

    # except:
    #     # si hay otro error de otra consideración, pse le dice ya registrado, aquí sería bueno ser más específico
    #     raise HTTPException(status_code=401, detail="Email ya registrado")

    if len(user.contrasena_usuario) < 8:
        raise HTTPException(status_code=401, detail="Password too short")

    try:
        # probamos a crear y registrar el usuario
        db_user = models.Usuario(
            email_usuario=user.email_usuario,
            contrasena_usuario=_hash.bcrypt.hash(user.contrasena_usuario),
        )
        db.add(db_user)
        db.commit()

        db.refresh(db_user)

        if returnUser:
            # si estabamos creando un usuario, no hace falta un token para que se identifique, simplemente devolvemos el usuario
            return db_user
        else:
            return await create_token(db_user)
    except:
       raise HTTPException(status_code=400, detail="Email already registered")

async def authenticate_user(email: str, password: str, db):
    # try:
    user = await get_user_by_email(email, db)
    # coge el usuario desde el mail y comprueba sin la contraseña es correcta

    if not user:
        return False
    
    if not user.verify_password(password):
        return False
    
    return user

    # except:
    #     raise HTTPException(status_code=400, detail="Incorrect email or password")

async def get_user_by_email(email: str, db):
    # devuleve el usuario en función del correo
    # try:
    user = db.query(models.Usuario).filter(models.Usuario.email_usuario == email).first()

    if user:
        return user
    else:
        return False

async def create_token(user: models.Usuario):
    # crea un token usando la clave jwt
    JWT_SECRET = config("JWT_SECRET")
    user_obj = schemas.User.from_orm(user)

    token = jwt.encode(user_obj.dict(), JWT_SECRET)
    
    return dict(access_token=token, token_type="bearer")
