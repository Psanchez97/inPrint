from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import passlib.hash as _hash



class Archivo(Base):
    __tablename__ = 'archivo'
    id = Column(Integer, primary_key=True)
    nombre_archivo = Column(String, nullable=False)

class Material(Base):
    __tablename__ = 'material'
    id = Column(Integer, primary_key=True)
    nombre_material = Column(String, nullable=False)
    precio_material = Column(Integer)

class Usuario(Base):
    __tablename__ = 'usuario'
    id = Column(Integer, primary_key=True)
    email_usuario = Column(String, nullable=False)
    nombre_usuario = Column(String)
    apellido_usuario = Column(String)
    direccion_usuario = Column(String)
    contrasena_usuario = Column(String, nullable=False)  

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.contrasena_usuario)


class Pedido(Base):
    __tablename__ = 'pedido'
    id = Column(Integer, primary_key=True)
    numero_pedido = Column(Integer, nullable=False)
    fecha_pedido = Column(DateTime, default=datetime.utcnow, nullable=False)
    estado = Column(String, nullable=False)
    material_pedido = Column(String, nullable=False)
    observaciones_pedido = Column(String)
    id_usuario = Column(Integer, ForeignKey('usuario.id'))
    id_material = Column(Integer, ForeignKey('material.id'))
    id_archivo = Column(Integer, ForeignKey('archivo.id'))
    
    usuario = relationship('Usuario', backref='pedidos')
    material = relationship('Material', backref='pedidos')
    archivo = relationship('Archivo', backref='pedidos')