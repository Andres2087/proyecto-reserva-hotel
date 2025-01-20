from pydantic import BaseModel
from datetime import date

class HotelBase(BaseModel):
    id_hotel:str
    nombre:str
    ciudad:str
    direccion:str
    imagen_url:str

class Hotel(HotelBase):
    class Config:
        orm_mode=True



class TipoHabitacionBase(BaseModel):
    id_tipo: str
    tipo: str
    descripcion: str
    precio: int
    capacidad_min: int
    capacidad_max: int

class TipoHabitacion(TipoHabitacionBase):
    class Config:
        orm_mode=True



class HabitacionBase(BaseModel):
    id_habitacion: str
    num_habitacion: int
    id_hotel: str
    id_tipo: str

class Habitacion(HabitacionBase):
    class Config:
        orm_mode=True



class ReservaBase(BaseModel):
    fecha_llegada: date
    fecha_salida: date
    id_hotel: str
    id_habitacion: str
    nombre_cliente: str
    apellido_cliente: str
    telefono_cliente: str
    correo_cliente: str
    cant_personas: int

class Reserva(ReservaBase):
    class Config:
        orm_mode=True

