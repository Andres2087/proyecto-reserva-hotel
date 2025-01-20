document.addEventListener("DOMContentLoaded", function () {
    // Recuperamos los datos de localStorage
    const hotelNombre = localStorage.getItem("hotelNombre");
    const hotelDireccion = localStorage.getItem("hotelDireccion");
    const fechaEntrada = localStorage.getItem("fechaEntrada");
    const fechaSalida = localStorage.getItem("fechaSalida");
    const cantidadPersonas = localStorage.getItem("cantidadPersonas");
    const tipoHabitacion = localStorage.getItem("tipoHabitacion");
    const numeroNoches = localStorage.getItem("numeroNoches");
    const precioTotal = localStorage.getItem("precioTotal");
    const habitacionId = localStorage.getItem("habitacionSeleccionada");
  
    // Asignamos los valores a los elementos correspondientes en reservar.html
    document.querySelector(".hotel-nombre").textContent = hotelNombre || "Nombre no disponible";
    document.querySelector(".hdireccion").textContent = hotelDireccion || "Dirección no disponible";
    document.querySelector(".entrada").innerHTML = `Entrada<br>${fechaEntrada || "Fecha no disponible"}`;
    document.querySelector(".salida").innerHTML = `Salida<br>${fechaSalida || "Fecha no disponible"}`;
    document.querySelector(".duracion").innerHTML = `Duración de la estancia:<br>${numeroNoches || "0"} noches`;
    document.querySelector(".cant").innerHTML = `Has seleccionado:<br>Habitación ${tipoHabitacion || "no especificada"} para ${cantidadPersonas || "0"} personas`;
    document.querySelector(".preciototal").textContent = `COP ${precioTotal || "0"}`;
  
    // Imprimimos el id de habitación seleccionada
    console.log("Id de habitación seleccionada:", habitacionId);
  
    // Función para obtener el id_hotel por el nombre del hotel
    function obtenerIdHotel(nombreHotel) {
        return fetch(`http://127.0.0.1:8000/consultahotel/nombre/${encodeURIComponent(nombreHotel)}`)
            .then(response => response.json())
            .then(data => {
                if (data.id_hotel) {
                    return data.id_hotel;
                } else {
                    console.error("Hotel no encontrado");
                    return null;
                }
            })
            .catch(error => console.error("Error al obtener id_hotel:", error));
    }
  
    // Añadir el evento de clic al botón para confirmar la reserva
    document.querySelector("#boton").addEventListener("click", function() {
        // Recuperamos los datos del formulario
        const nombre = document.querySelector("#nom").value;
        const apellido = document.querySelector("#ape").value;
        const correo = document.querySelector("#cor").value;
        const celular = document.querySelector("#cel").value;
  
        if (!nombre || !apellido || !correo || !celular) {
            alert("Por favor complete todos los campos.");
            return;
        }
  
        // Convertimos cantidadPersonas a entero
        const cantidadPersonasInt = parseInt(cantidadPersonas, 10);
  
        // Llamamos a la función obtenerIdHotel para obtener el id del hotel
        obtenerIdHotel(hotelNombre).then(idHotel => {
            if (idHotel) {
                // Si conseguimos el id_hotel, confirmamos la reserva
                console.log("Reserva confirmada:", {
                    nombre,
                    apellido,
                    correo,
                    celular,
                    idHotel, // Aquí es donde se usa el id_hotel
                    habitacionId,
                    fechaEntrada,
                    fechaSalida,
                    cantidadPersonas: cantidadPersonasInt, // Aseguramos que se envíe como número
                });
  
                // Aquí podrías hacer la petición al backend para registrar la reserva
                fetch('http://127.0.0.1:8000/reservas', {
                    method: 'POST',
                    body: JSON.stringify({
                        fecha_llegada: fechaEntrada,  // Aseguramos que se envíe el campo correcto
                        fecha_salida: fechaSalida,    // Aseguramos que se envíe el campo correcto
                        id_hotel: idHotel,            // Aseguramos que se envíe el campo correcto
                        id_habitacion: habitacionId,  // Aseguramos que se envíe el campo correcto
                        nombre_cliente: nombre,
                        apellido_cliente: apellido,
                        telefono_cliente: celular,
                        correo_cliente: correo,
                        cant_personas: cantidadPersonasInt // Enviamos como número
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                  .then(data => {
                      if (data.detail) {
                          console.log("Detalles del error:", data.detail);
                          console.log("Detalles del error:", data.detail);
                          Swal.fire({ 
                            title: "No se registró la reserva", 
                            text: data.detail,  // Aquí se muestra el mensaje de error
                            icon: "error",
                            confirmButtonText: 'Intentar de nuevo' 
                        });
                      } else {
                          // Si la reserva se ha registrado correctamente, muestra el mensaje con SweetAlert
                          Swal.fire({
                              title: "Reserva Registrada", 
                              text: "Su reserva ha sido registrada de manera correcta", 
                              icon: "success",
                              draggable: true,
                              confirmButtonText: 'OK' 
                          });
                      }
                  }).catch(error => {
                      console.error("Error al registrar la reserva:", error);
                  });
            }
        }).catch(error => {
            console.error("Error al confirmar la reserva:", error);
        });
    });
  });
  