const apiURL = 'http://127.0.0.1:8000/consultarhoteles'; // Endpoint para consultar la lista de hoteles

function consultarApi() {
    fetch(apiURL)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error('Error: No se pudo conectar a la API');
            }
            return respuesta.json();
        })
        .then((datos) => {
            console.log('Datos obtenidos de la API:', datos);

            const tablaBody = document.querySelector('tbody'); // Seleccionar el cuerpo de la tabla
             //tablaBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

            datos.forEach((hotel) => {
                // Crear una fila para cada hotel
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${hotel.id_hotel}</td>
                    <td>${hotel.nombre}</td>
                    <td>${hotel.ciudad}</td>
                    <td>${hotel.direccion}</td>
                    <td>${hotel.imagen_url}</td>
                `;
                tablaBody.appendChild(fila); // Añadir la fila al cuerpo de la tabla
            });
        })
        .catch((error) => {
            console.error('Error al consultar los datos:', error);
        });
}

// Llamar a la función para cargar los datos al cargar la página
consultarApi();
