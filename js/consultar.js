// Obtén las ciudades
async function obtenerCiudades() {
    try {
        const response = await fetch('http://localhost:8000/ciudades');
        if (!response.ok) throw new Error('Error al obtener las ciudades');
        const ciudades = await response.json();

        // Obtener el select de ciudades
        const select = document.getElementById('ci');
        select.innerHTML = ''; // Limpiar las opciones anteriores

        // Agregar la opción por defecto (Elige una ciudad)
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = 'Elige una ciudad';
        select.appendChild(defaultOption);

        // Agregar las nuevas opciones al select
        ciudades.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad; // Usar el nombre de la ciudad
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Obtén los hoteles por ciudad seleccionada
async function obtenerHotelesPorCiudad(ciudad) {
    try {
        const response = await fetch(`http://localhost:8000/hoteles/${ciudad}`);
        if (!response.ok) throw new Error('Error al obtener los hoteles');
        const hoteles = await response.json(); // Suponiendo que hoteles es un array de strings

        // Obtener el select de hoteles
        const selectHoteles = document.getElementById('ho');
        selectHoteles.innerHTML = ''; // Limpiar las opciones anteriores

        // Agregar la opción por defecto (Elige un hotel)
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = 'Elige un hotel';
        selectHoteles.appendChild(defaultOption);

        // Filtrar los hoteles que coinciden con la ciudad
        hoteles.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel; // El nombre del hotel que es un string
            option.textContent = hotel; // Usar el nombre del hotel
            selectHoteles.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Llamar a la función para cargar las ciudades cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    obtenerCiudades();

    // Evento para obtener los hoteles al seleccionar una ciudad
    const ciudadSelect = document.getElementById('ci');
    ciudadSelect.addEventListener('change', (event) => {
        const ciudadSeleccionada = event.target.value.trim();
        
        // Si la ciudad no está vacía, obtener los hoteles
        if (ciudadSeleccionada) {
            obtenerHotelesPorCiudad(ciudadSeleccionada);
        } else {
            // Limpiar el select de hoteles si no hay ciudad seleccionada
            const selectHoteles = document.getElementById('ho');
            selectHoteles.innerHTML = '';
        }
    });
});
