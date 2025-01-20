document.addEventListener("DOMContentLoaded", function () {
    // Recupera los valores almacenados en localStorage
    const fechaInicio = localStorage.getItem("fechaInicio");
    const fechaFin = localStorage.getItem("fechaFin");
    const cantidadPersonas = localStorage.getItem("cantidadPersonas");
    const hotelSeleccionado = localStorage.getItem("hotelSeleccionado");

    // Asigna los valores a los campos del formulario si existen
    if (fechaInicio) document.getElementById("fentrada").value = fechaInicio;
    if (fechaFin) document.getElementById("fsalida").value = fechaFin;
    if (cantidadPersonas) document.getElementById("cantp").value = cantidadPersonas;
    if (hotelSeleccionado) {
        const hotelTitulo = document.querySelector(".hotel-nombre");
        if (hotelTitulo) hotelTitulo.textContent = hotelSeleccionado; // Cambia el título del hotel
    }

    // Función para actualizar las opciones del selector según la cantidad de personas
    const cantPersonasInput = document.getElementById("cantp");
    const tipoHabitacionSelect = document.getElementById("tipoha");

    // Define las opciones de habitación y sus límites de personas
    const habitaciones = {
        Standard: { nombre: "Standard", min: 1, max: 2 },
        Ejecutiva: { nombre: "Ejecutiva", min: 2, max: 4 },
        Familiar: { nombre: "Familiar", min: 4, max: 6 },
        Deluxe: { nombre: "Deluxe", min: 2, max: 3 }
    };

    // Función para actualizar las opciones de habitaciones según la cantidad de personas
    function actualizarOpciones(cantidadPersonas) {
        // Limpia las opciones actuales
        tipoHabitacionSelect.innerHTML = '<option value="" disabled selected>Elije un tipo de habitación</option>';

        // Agrega solo las opciones válidas según la cantidad de personas
        for (const [clave, { nombre, min, max }] of Object.entries(habitaciones)) {
            if (cantidadPersonas >= min && cantidadPersonas <= max) {
                const option = document.createElement("option");
                option.value = clave;
                option.textContent = nombre;
                tipoHabitacionSelect.appendChild(option);
            }
        }

        // Si no hay opciones válidas, muestra un mensaje o desactiva el selector
        if (tipoHabitacionSelect.options.length === 1) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Sin opciones disponibles";
            option.disabled = true;
            tipoHabitacionSelect.appendChild(option);
        }
    }

    // Asegúrate de que los datos estén disponibles antes de actualizar las opciones
    if (cantidadPersonas) {
        // Actualiza las opciones cuando se cargue la página
        actualizarOpciones(parseInt(cantidadPersonas, 10));

        // Escucha el evento 'input' del campo de cantidad de personas
        if (cantPersonasInput) {
            cantPersonasInput.addEventListener("input", function () {
                const cantidadPersonas = parseInt(this.value, 10);

                // Solo actualiza si el valor es válido
                if (cantidadPersonas >= 1 && cantidadPersonas <= 6) {
                    actualizarOpciones(cantidadPersonas);
                } else {
                    // Si el valor es inválido, desactiva el selector
                    tipoHabitacionSelect.innerHTML = '<option value="" disabled selected>Elije un tipo de habitación</option>';
                }
            });
        }
    }

    // Consultar los datos del hotel
    if (hotelSeleccionado) {
        // Realiza la solicitud GET al backend para obtener los datos del hotel
        fetch(`http://127.0.0.1:8000/consultahotel/nombre/${encodeURIComponent(hotelSeleccionado)}`)
            .then(response => response.json())
            .then(data => {
                if (data.mensaje) {
                    console.error("Error:", data.mensaje);
                } else {
                    // Inserta la dirección del hotel
                    const hotelDireccion = document.querySelector(".hotel-direccion");
                    if (hotelDireccion) hotelDireccion.textContent = data.direccion;

                    // Inserta la URL de la imagen del hotel
                    const hotelImagen = document.querySelector(".hotel-foto img");
                    if (hotelImagen) hotelImagen.src = data.imagen_url;
                }
            })
            .catch(error => console.error("Error al consultar el hotel:", error));
    } else {
        console.error("No se encontró el nombre del hotel en localStorage.");
    }

    // Funciones de fechas y precio
    const fentradaInput = document.getElementById("fentrada");
    const fsalidaInput = document.getElementById("fsalida");
    const numeroNoches = document.getElementById("numero-noches");
    const precioElemento = document.getElementById("precio");

    // Función para calcular las noches
    function calcularNoches() {
        const fechaInicio = new Date(fentradaInput.value);
        const fechaFin = new Date(fsalidaInput.value);

        if (isNaN(fechaInicio) || isNaN(fechaFin)) {
            console.error("Una o ambas fechas son inválidas.");
            return;
        }

        if (fechaInicio >= fechaFin) {
            console.error("La fecha de salida debe ser posterior a la fecha de entrada.");
            return;
        }

        const diferenciaTiempo = fechaFin - fechaInicio;
        const noches = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

        if (noches <= 0) {
            console.error("El número de noches es inválido.");
            return;
        }

        numeroNoches.textContent = noches;
        actualizarPrecio(); // Recalcula el precio al cambiar las fechas
    }

    // Función para actualizar el precio
    function actualizarPrecio() {
        const tipoSeleccionado = tipoHabitacionSelect.value;
        const noches = parseInt(numeroNoches.textContent);

        if (tipoSeleccionado && noches > 0) {
            fetch(`http://127.0.0.1:8000/tipohabitacion/${encodeURIComponent(tipoSeleccionado)}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const precioPorNoche = data[0].precio;
                        const totalPrecio = precioPorNoche * noches;
                        precioElemento.textContent = totalPrecio;
                    } else {
                        console.error("No se encontró el precio para este tipo de habitación");
                    }
                })
                .catch(error => console.error("Error al obtener el precio:", error));
        } else {
            precioElemento.textContent = "0";
        }
    }

    // Ejecuta la función calcularNoches al cargar la página para obtener el número inicial de noches
    calcularNoches();

    // Actualiza el precio al cambiar el tipo de habitación
    tipoHabitacionSelect.addEventListener("change", function () {
        actualizarPrecio();
    });

    // Recalcula el número de noches y el precio cuando cambian las fechas
    fentradaInput.addEventListener("change", calcularNoches);
    fsalidaInput.addEventListener("change", calcularNoches);
});



document.addEventListener("DOMContentLoaded", function () {
    const hotelNombre = document.querySelector(".hotel-nombre").textContent;
    const tipoHabitacionSelect = document.getElementById("tipoha");
    const habitacionesGrid = document.querySelector(".habitaciones-grid");

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

    // Función para obtener el id_tipo por el tipo de habitación
    function obtenerIdTipo(tipo) {
        return fetch(`http://127.0.0.1:8000/tipohabitacion/${encodeURIComponent(tipo)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    return data[0].id_tipo;
                } else {
                    console.error("Tipo de habitación no encontrado");
                    return null;
                }
            })
            .catch(error => console.error("Error al obtener id_tipo:", error));
    }

    // Función para obtener las habitaciones por id_hotel e id_tipo
    function obtenerHabitaciones(idHotel, idTipo) {
        return fetch(`http://127.0.0.1:8000/habitaciones/${idHotel}/${idTipo}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    mostrarHabitaciones(data);
                } else {
                    console.error("No se encontraron habitaciones");
                    habitacionesGrid.innerHTML = '<p>No hay habitaciones disponibles</p>';
                }
            })
            .catch(error => console.error("Error al obtener habitaciones:", error));
    }

    // Función para mostrar las habitaciones en el grid
    function mostrarHabitaciones(habitaciones) {
        habitacionesGrid.innerHTML = ''; // Limpiar el grid antes de mostrar nuevas habitaciones
        habitaciones.forEach(habitacion => {
            const divHabitacion = document.createElement("div");
            divHabitacion.classList.add("habitacion");
            divHabitacion.dataset.habitacion = habitacion.id_habitacion;
            divHabitacion.textContent = habitacion.num_habitacion;
            habitacionesGrid.appendChild(divHabitacion);
        });
    }

    // Escuchar el cambio de tipo de habitación
    tipoHabitacionSelect.addEventListener("change", function () {
        const tipoSeleccionado = tipoHabitacionSelect.value;
        if (tipoSeleccionado) {
            obtenerIdHotel(hotelNombre).then(idHotel => {
                if (idHotel) {
                    obtenerIdTipo(tipoSeleccionado).then(idTipo => {
                        if (idTipo) {
                            obtenerHabitaciones(idHotel, idTipo);
                        }
                    });
                }
            });
        }
    });

    // Al cargar la página, obtener las habitaciones iniciales si ya hay un tipo de habitación seleccionado
    const tipoInicial = tipoHabitacionSelect.value;
    if (tipoInicial) {
        obtenerIdHotel(hotelNombre).then(idHotel => {
            if (idHotel) {
                obtenerIdTipo(tipoInicial).then(idTipo => {
                    if (idTipo) {
                        obtenerHabitaciones(idHotel, idTipo);
                    }
                });
            }
        });
    }
});




document.addEventListener("DOMContentLoaded", function () {
    const reservarBtn = document.getElementById("reservar-btn");
    if (reservarBtn) {
        reservarBtn.addEventListener("click", function () {
            // Capturamos los valores seleccionados
            const hotelNombre = document.querySelector(".hotel-nombre").textContent;
            const hotelDireccion = document.querySelector(".hotel-direccion").textContent;
            const fechaEntrada = document.getElementById("fentrada").value;
            const fechaSalida = document.getElementById("fsalida").value;
            const cantidadPersonas = document.getElementById("cantp").value;
            const tipoHabitacion = document.getElementById("tipoha").value;
            const numeroNoches = document.getElementById("numero-noches").textContent;
            const precioTotal = document.getElementById("precio").textContent;

            // Guardamos los valores en localStorage
            localStorage.setItem("hotelNombre", hotelNombre);
            localStorage.setItem("hotelDireccion", hotelDireccion);

            localStorage.setItem("fechaEntrada", fechaEntrada);
            localStorage.setItem("fechaSalida", fechaSalida);
            localStorage.setItem("cantidadPersonas", cantidadPersonas);
            localStorage.setItem("tipoHabitacion", tipoHabitacion);
            localStorage.setItem("numeroNoches", numeroNoches);
            localStorage.setItem("precioTotal", precioTotal);

            // Redirigir a la página de reserva
            window.location.href = "reservar.html";
        });
    } else {
        console.error("El botón con ID 'reservar-btn' no existe en el DOM.");
    }
});


