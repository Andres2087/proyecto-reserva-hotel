from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from modelo.models import Base
from modelo.schemas import HotelBase,TipoHabitacionBase,HabitacionBase,ReservaBase,Hotel,TipoHabitacion,Habitacion,Reserva
from modelo.crud import consultar_hotel,insertar_hotel,consultar_hotel_por_nombre,insertar_tipo_habitacion,insertar_habitacion,insertar_habitaciones,insertar_reserva, obtener_ciudades, obtener_hoteles_por_ciudad, insertar_hoteles, consultar_tipo_habitacion_por_tipo, consultar_habitaciones_por_hotel_y_tipo, obtener_id_habitacion, verificar_reserva
from controlador.conexiondb import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cambia esto para especificar dominios permitidos
    allow_credentials=True,
    allow_methods=["*"], #Métodos permitidos (GET,POST,etc.)
    allow_headers=["*"], # Headers permitidos
)

def conexiondb():
    db=SessionLocal()
    try:
        yield db
 
    finally:db.close()


#ENDPOINTS PARA HOTELES get post put delete
@app.get("/consultarhoteles",response_model=list[Hotel])
async def get_hoteles(db:Session = Depends(conexiondb)):
    return consultar_hotel(db)

 
@app.get("/consultahotel/nombre/{nombre}",response_model=HotelBase)
async def get_hotel_nombre(nombre:str,db:Session = Depends(conexiondb)):
    hotel = consultar_hotel_por_nombre(nombre=nombre,db=db) 
    if hotel is None:
        return {"mensaje":"Hotel no encontrado"}
    return hotel


@app.post("/insertarhotel", response_model=Hotel)
async def registrar_hotel(hotel:HotelBase, db:Session=Depends(conexiondb)):
    return insertar_hotel(db,hotel)

@app.post("/insertarhoteles", response_model=list[Hotel])
async def registrar_hoteles(hoteles: list[HotelBase], db: Session = Depends(conexiondb)):
    return insertar_hoteles(db, hoteles)


@app.post("/insertartipohabitacion", response_model=TipoHabitacion)
async def registrar_tipo_habitacion(tipo_habitacion: TipoHabitacionBase, db: Session = Depends(conexiondb)):
    return insertar_tipo_habitacion(db, tipo_habitacion)


@app.post("/insertarhabitacion", response_model=Habitacion)
async def registrar_habitacion(habitacion: HabitacionBase, db: Session = Depends(conexiondb)):
    return insertar_habitacion(db, habitacion)


@app.post("/insertarhabitaciones", response_model=list[Habitacion])
async def registrar_habitaciones(habitaciones: list[HabitacionBase], db: Session = Depends(conexiondb)):
    return insertar_habitaciones(db, habitaciones)


@app.post("/insertarreserva", response_model=Reserva)
async def registrar_reserva(reserva: ReservaBase, db: Session = Depends(conexiondb)):
    return insertar_reserva(db, reserva)


# Rutas para obtener ciudades y hoteles según el filtro
@app.get("/ciudades", response_model=list[str])
async def get_ciudades(db: Session = Depends(conexiondb)):
    ciudades = obtener_ciudades(db)
    return ciudades

@app.get("/hoteles/{ciudad}", response_model=list[str])
async def get_hoteles_por_ciudad(ciudad: str, db: Session = Depends(conexiondb)):
    hoteles = obtener_hoteles_por_ciudad(db, ciudad)
    return hoteles


@app.get("/tipohabitacion/{tipo}", response_model=list[TipoHabitacionBase])
async def get_tipo_habitacion_por_tipo(tipo: str, db: Session = Depends(conexiondb)):
    tipos_habitacion = consultar_tipo_habitacion_por_tipo(tipo=tipo, db=db)
    if not tipos_habitacion:
        return {"mensaje": f"No se encontraron tipos de habitación con el tipo {tipo}"}
    return tipos_habitacion


@app.get("/habitaciones/{id_hotel}/{id_tipo}", response_model=list[HabitacionBase])
async def get_habitaciones_por_hotel_y_tipo(id_hotel: str, id_tipo: str, db: Session = Depends(conexiondb)):
    habitaciones = consultar_habitaciones_por_hotel_y_tipo(id_hotel=id_hotel, id_tipo=id_tipo, db=db)
    if not habitaciones:
        return {"mensaje": f"No se encontraron habitaciones para el hotel {id_hotel} y tipo {id_tipo}"}
    return habitaciones



@app.post("/reservas", response_model=Reserva)
async def crear_reserva(reserva: ReservaBase, db: Session = Depends(conexiondb)):
    return insertar_reserva(db, reserva)



@app.get("/idhabitacion/{id_hotel}/{id_tipo}/{num_habitacion}", response_model=str)
async def get_id_habitacion(id_hotel: str, id_tipo: str, num_habitacion: int, db: Session = Depends(conexiondb)):
    id_habitacion = obtener_id_habitacion(id_hotel=id_hotel, id_tipo=id_tipo, num_habitacion=num_habitacion, db=db)
    if not id_habitacion:
        return {"mensaje": f"No se encontró la habitación con el hotel {id_hotel}, tipo {id_tipo} y número {num_habitacion}"}
    return id_habitacion[0] 




@app.get("/verificarreserva/{id_habitacion}", response_model=bool)
async def verificar_habitacion_reservada(
    id_habitacion: str,
    fecha_llegada: str,
    fecha_salida: str,
    db: Session = Depends(conexiondb)
):
    """
    Endpoint que verifica si una habitación está reservada en un rango de fechas dado.
    """
    reservada = verificar_reserva(id_habitacion, fecha_llegada, fecha_salida, db)
    return reservada



@app.get("/habitaciones_disponibles/{id_hotel}/{fecha_llegada}/{fecha_salida}", response_model=list[dict])
async def get_habitaciones_disponibles(
    id_hotel: str,
    fecha_llegada: str,
    fecha_salida: str,
    db: Session = Depends(conexiondb)
):
    """
    Devuelve las habitaciones de un hotel con información de si están disponibles.
    """
    habitaciones = db.query(Habitacion).filter(Habitacion.id_hotel == id_hotel).all()
    resultado = []
    for habitacion in habitaciones:
        reservada = verificar_reserva(habitacion.id_habitacion, fecha_llegada, fecha_salida, db)
        resultado.append({
            "id_habitacion": habitacion.id_habitacion,
            "num_habitacion": habitacion.num_habitacion,
            "disponible": not reservada
        })
    return resultado
