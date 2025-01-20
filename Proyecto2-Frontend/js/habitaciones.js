// Seleccionar el contenedor de habitaciones
const habitacionesGrid = document.querySelector('.habitaciones-grid');
const reservarBtn = document.getElementById('reservar-btn');
let habitacionSeleccionada = null;

// Asegúrate de que el botón "reservar" esté inicialmente deshabilitado
if (reservarBtn) {
  reservarBtn.disabled = true;
}

// Delegar el evento "click" en el contenedor de habitaciones
habitacionesGrid.addEventListener('click', (event) => {
  const clickedElement = event.target;

  // Verifica si el elemento clickeado tiene la clase "habitacion"
  if (clickedElement.classList.contains('habitacion')) {
    // Quitar selección previa
    if (habitacionSeleccionada) {
      habitacionSeleccionada.classList.remove('seleccionada');
    }

    // Seleccionar la nueva habitación
    habitacionSeleccionada = clickedElement;
    habitacionSeleccionada.classList.add('seleccionada');

    // Habilitar el botón de reservar
    if (reservarBtn) {
      reservarBtn.disabled = false;
    }
  }
});

// Redirigir al hacer clic en reservar
if (reservarBtn) {
  reservarBtn.addEventListener('click', () => {
    if (habitacionSeleccionada) {
      const habitacionNumero = habitacionSeleccionada.dataset.habitacion;
      // Redirigir a otra página, pasando el número de habitación como parámetro en la URL
      window.location.href = `reservar.html?habitacion=${habitacionNumero}`;
    }
  });
}




// Redirigir al hacer clic en reservar
if (reservarBtn) {
  reservarBtn.addEventListener('click', () => {
    if (habitacionSeleccionada) {
      const habitacionNumero = habitacionSeleccionada.dataset.habitacion;
      
      // Guardar el número de habitación en localStorage
      localStorage.setItem("habitacionSeleccionada", habitacionNumero);
      
      // Redirigir a otra página, pasando el número de habitación como parámetro en la URL
      window.location.href = `reservar.html?habitacion=${habitacionNumero}`;
    }
  });
}

