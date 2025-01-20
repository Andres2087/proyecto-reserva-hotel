from sqlalchemy.orm import Session
from modelo.models import Hotel,TipoHabitacion,Habitacion,Reserva
from modelo.schemas import HotelBase,TipoHabitacionBase,HabitacionBase,ReservaBase
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

def consultar_hotel(db:Session):
    return db.query(Hotel).all()


def consultar_hotel_por_nombre(nombre:str, db:Session):
    return db.query(Hotel).filter(Hotel.nombre == nombre).first()


def insertar_hotel(db:Session, hotel:HotelBase):
    db_hotel_existente=db.query(Hotel).filter(Hotel.id_hotel == hotel.id_hotel).first()
    if db_hotel_existente:
        raise HTTPException(status_code=400, detail=f'El hotel con el nombre {hotel.id_hotel} ya existe')
    
    try:
        db_hotel=Hotel(**hotel.dict())
        db.add(db_hotel)
        db.commit()
        db.refresh(db_hotel)
        return db_hotel
    except IntegrityError as e:
        db.rollback
        raise HTTPException(status_code=500, detail=f'Error al registrar el hotel')

def insertar_hoteles(db: Session, hoteles: list[HotelBase]):
    hoteles_registrados = []
    for hotel in hoteles:
        db_hotel_existente = db.query(Hotel).filter(Hotel.id_hotel == hotel.id_hotel).first()
        if db_hotel_existente:
            raise HTTPException(
                status_code=400,
                detail=f'El hotel con el ID {hotel.id_hotel} ya existe'
            )

        try:
            db_hotel = Hotel(**hotel.dict())
            db.add(db_hotel)
            db.commit()
            db.refresh(db_hotel)
            hoteles_registrados.append(db_hotel)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f'Error al registrar el hotel con ID {hotel.id_hotel}'
            )
    return hoteles_registrados


def insertar_tipo_habitacion(db: Session, tipo_habitacion: TipoHabitacionBase):
    db_tipo_existente = db.query(TipoHabitacion).filter(TipoHabitacion.id_tipo == tipo_habitacion.id_tipo).first()
    if db_tipo_existente:
        raise HTTPException(status_code=400, detail=f'El tipo de habitación con el ID {tipo_habitacion.id_tipo} ya existe')

    try:
        db_tipo_habitacion = TipoHabitacion(**tipo_habitacion.dict())
        db.add(db_tipo_habitacion)
        db.commit()
        db.refresh(db_tipo_habitacion)
        return db_tipo_habitacion
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail='Error al registrar el tipo de habitación')
    

def insertar_habitacion(db: Session, habitacion: HabitacionBase):
    db_habitacion_existente = db.query(Habitacion).filter(Habitacion.id_habitacion == habitacion.id_habitacion).first()
    if db_habitacion_existente:
        raise HTTPException(status_code=400, detail=f'La habitación con el ID {habitacion.id_habitacion} ya existe')

    try:
        db_habitacion = Habitacion(**habitacion.dict())
        db.add(db_habitacion)
        db.commit()
        db.refresh(db_habitacion)
        return db_habitacion
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail='Error al registrar la habitación')
    

def insertar_habitaciones(db: Session, habitaciones: list[HabitacionBase]):
    habitaciones_registradas = []
    for habitacion in habitaciones:
        db_habitacion_existente = db.query(Habitacion).filter(Habitacion.id_habitacion == habitacion.id_habitacion).first()
        if db_habitacion_existente:
            raise HTTPException(
                status_code=400, 
                detail=f'La habitación con el ID {habitacion.id_habitacion} ya existe'
            )
        
        try:
            db_habitacion = Habitacion(**habitacion.dict())
            db.add(db_habitacion)
            db.commit()
            db.refresh(db_habitacion)
            habitaciones_registradas.append(db_habitacion)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=500, 
                detail=f'Error al registrar la habitación con ID {habitacion.id_habitacion}'
            )
    return habitaciones_registradas
    

def insertar_reserva(db: Session, reserva: ReservaBase):
    try:
        db_reserva = Reserva(**reserva.dict())
        db.add(db_reserva)
        db.commit()
        db.refresh(db_reserva)
        return db_reserva
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail='Error al registrar la reserva')
    


# Función para obtener las ciudades disponibles
def obtener_ciudades(db: Session):
    return [ciudad[0] for ciudad in db.query(Hotel.ciudad).distinct().all()]


def obtener_hoteles_por_ciudad(db: Session, ciudad: str):
    hoteles = db.query(Hotel).filter(Hotel.ciudad == ciudad).all()
    if not hoteles:
        raise HTTPException(status_code=404, detail=f"No se encontraron hoteles en la ciudad {ciudad}")
    return [hotel.nombre for hotel in hoteles]  # Retorna solo los nombres



def consultar_tipo_habitacion_por_tipo(tipo: str, db: Session):
    return db.query(TipoHabitacion).filter(TipoHabitacion.tipo == tipo).all()


def consultar_habitaciones_por_hotel_y_tipo(id_hotel: str, id_tipo: str, db: Session):
    return db.query(Habitacion).filter(
        Habitacion.id_hotel == id_hotel,
        Habitacion.id_tipo == id_tipo
    ).all()


def insertar_reserva(db: Session, reserva: ReservaBase):
    # Verificar que la habitación exista
    habitacion = db.query(Habitacion).filter(Habitacion.id_habitacion == reserva.id_habitacion).first()
    if not habitacion:
        raise HTTPException(status_code=404, detail=f"La habitación con ID {reserva.id_habitacion} no existe")
    
    # Verificar que el hotel exista
    hotel = db.query(Hotel).filter(Hotel.id_hotel == reserva.id_hotel).first()
    if not hotel:
        raise HTTPException(status_code=404, detail=f"El hotel con ID {reserva.id_hotel} no existe")
    
    # Verificar si hay conflictos de fechas
    conflictos = db.query(Reserva).filter(
        Reserva.id_habitacion == reserva.id_habitacion,
        Reserva.fecha_llegada < reserva.fecha_salida,
        Reserva.fecha_salida > reserva.fecha_llegada
    ).all()

    if conflictos:
        raise HTTPException(
            status_code=400,
            detail=f"La habitación con ID {reserva.id_habitacion} ya está reservada en las fechas seleccionadas"
        )

    try:
        db_reserva = Reserva(**reserva.dict())
        db.add(db_reserva)
        db.commit()
        db.refresh(db_reserva)
        return db_reserva
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al registrar la reserva")



def obtener_id_habitacion(id_hotel: str, id_tipo: str, num_habitacion: int, db: Session):
    return db.query(Habitacion.id_habitacion).filter(
        Habitacion.id_hotel == id_hotel,
        Habitacion.id_tipo == id_tipo,
        Habitacion.num_habitacion == num_habitacion
    ).first()



def verificar_reserva(id_habitacion: str, fecha_llegada: str, fecha_salida: str, db: Session):
    """
    Verifica si una habitación está reservada en un rango de fechas dado.
    """
    reserva_existente = db.query(Reserva).filter(
        Reserva.id_habitacion == id_habitacion,
        Reserva.fecha_salida > fecha_llegada,  # La fecha de salida de una reserva debe ser después de la llegada buscada.
        Reserva.fecha_llegada < fecha_salida   # La fecha de llegada de una reserva debe ser antes de la salida buscada.
    ).first()
    return reserva_existente is not None
