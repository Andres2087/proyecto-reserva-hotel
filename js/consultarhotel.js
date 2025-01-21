document.addEventListener('DOMContentLoaded',function(){
    async function buscarHotel(event) {
        alert("en funcion")
        event.preventDefault()

        const nombre=document.getElementById('hotel').value

        try{
            const respuesta=await fetch (`http://127.0.0.1:8000/consultahotel/nombre/${nombre}`)
            if(respuesta.ok){
                const hotel=await respuesta.json()
                console.log(hotel)
                const resultados=document.getElementById("resultado")
                resultados.innerHTML=`<div>${hotel.nombre}</div>
                                      <div>${hotel.ciudad}</div>
                                      <div>${hotel.direccion}</div>
                                      <div>${hotel.imagen_url}</div>
                                     `
            }
            else{
                const errorResp = await respuesta.json()   
                console.error(errorResp)
            }
        }catch(error){
            console.error("Error en la consulta ",error)
        }

    }

    document.getElementById("formBusqueda").addEventListener("submit",buscarHotel)
})


