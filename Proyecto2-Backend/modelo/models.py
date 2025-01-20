from sqlalchemy import Column,Integer,String,Float,Date,ForeignKey
from sqlalchemy.orm import relationship
from controlador.conexiondb import Base

class Hotel(Base):
    __tablename__="hoteles"
    id_hotel=Column(String(20), primary_key=True, index=True)
    nombre=Column(String(50), nullable=False)
    ciudad=Column(String(50), nullable=False)
    direccion=Column(String(50), nullable=False)
    imagen_url=Column(String(255), nullable=False)

    habitacion = relationship("Habitacion", back_populates="hoteles")
    reservas = relationship("Reserva", back_populates="hoteles")

class TipoHabitacion(Base):
    __tablename__="tipo_habitacion"
    id_tipo=Column(String(10), primary_key=True, index=True)
    tipo=Column(String(30), nullable=False)
    descripcion=Column(String(300), nullable=False)
    precio=Column(Integer, nullable=False)
    capacidad_min=Column(Integer, nullable=False)
    capacidad_max=Column(Integer, nullable=False)

    habitacion = relationship("Habitacion", back_populates="tipo_habitacion")

class Habitacion(Base):
    __tablename__ = "habitacion"
    id_habitacion = Column(String(20), primary_key=True, index=True)
    num_habitacion = Column(Integer, nullable=False)
    id_hotel = Column(String(20), ForeignKey("hoteles.id_hotel"), nullable=False)
    id_tipo = Column(String(10), ForeignKey("tipo_habitacion.id_tipo"), nullable=False)

    hoteles = relationship("Hotel", back_populates="habitacion")
    tipo_habitacion = relationship("TipoHabitacion", back_populates="habitacion")
    reservas = relationship("Reserva", back_populates="habitacion")


class Reserva(Base):
    __tablename__ = "reservas"
    id_reserva = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha_llegada = Column(Date, nullable=False)
    fecha_salida = Column(Date, nullable=False)
    id_hotel = Column(String(20), ForeignKey("hoteles.id_hotel"), nullable=False)
    id_habitacion = Column(String(20), ForeignKey("habitacion.id_habitacion"), nullable=False)
    nombre_cliente = Column(String(50), nullable=False)
    apellido_cliente = Column(String(50), nullable=False)
    telefono_cliente = Column(String(20), nullable=False)
    correo_cliente = Column(String(20), nullable=False)
    cant_personas = Column(Integer, nullable=False)

    hoteles = relationship("Hotel", back_populates="reservas")
    habitacion = relationship("Habitacion", back_populates="reservas")
