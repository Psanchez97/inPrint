from typing import List, Optional
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class _UserBase(BaseModel):
    email_usuario: str = None

class UserCreate(_UserBase):
    contrasena_usuario: str
    class Config:
        orm_mode = True

class User(_UserBase):
    id: int
    class Config:
        orm_mode = True

class LogInRequest(BaseModel):
    username: str = None
    password: str = None
