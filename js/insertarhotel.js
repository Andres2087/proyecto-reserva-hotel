document.addEventListener('DOMContentLoaded',function(){    
    alert("Entrando a insertar")
    
    const miformhotel=document.getElementById('form-hotel')

    miformhotel.addEventListener('submit', async(event)=>{
    alert("envio")

        event.preventDefault(); 

        const formData=new FormData(miformhotel)
        
        const data=Object.fromEntries(formData.entries())

        try{
            const respuesta = await fetch('http://127.0.0.1:8000/insertarhotel',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })

            if (respuesta.ok){
                const respuestaAPI= await respuesta.json()
                console.log('Respuesta de la API ', respuestaAPI)
                Swal.fire({
                    title: "Hotel Registrado",
                    text: "Los datos se guardaron en la base de datos",
                    icon: "success",
                    draggable: true,
                    confirmButtonText: 'OK' 
                });
            }
            else{
                console.error("Error en la solicitud ",respuesta.status)
                Swal.fire({
                    title: "No se regitro",
                    text: "Hubo problemas al registrar el hotel",
                    icon: "error",
                    confirmButtonText: 'Intentar de nuevo' 
                });
            }
        } catch(error){
            console.error("Error en la solicitud ", error)
        }
    })

})