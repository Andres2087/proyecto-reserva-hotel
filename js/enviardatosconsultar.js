document.addEventListener("DOMContentLoaded", function () {
    const botonConsultar = document.getElementById("consultar");

    if (botonConsultar) {
        botonConsultar.addEventListener("click", function (event) {
            event.preventDefault(); // Evita el envío del formulario por defecto

            // Captura los valores ingresados en los campos
            const fechaInicio = document.getElementById("fi").value;
            const fechaFin = document.getElementById("ff").value;
            const cantidadPersonas = document.getElementById("cant").value;
            const hotelSeleccionado = document.getElementById("ho").value;

            // Almacena los valores en localStorage
            localStorage.setItem("fechaInicio", fechaInicio);
            localStorage.setItem("fechaFin", fechaFin);
            localStorage.setItem("cantidadPersonas", cantidadPersonas);
            localStorage.setItem("hotelSeleccionado", hotelSeleccionado);

            // Redirige a seleccionhabitacion.html
            window.location.href = "seleccionhabitacion.html";
        });
    } else {
        console.error("El botón con ID 'consultar' no existe.");
    }
});
