console.log("El archivo JavaScript del lado del cliente está cargado")

//Selecciona el elemento form
const weatherForm = document.querySelector('form')

//Selecciona el elemento input
const search = document.querySelector('input')

//Seleciona el elemento p con id message-1
const messageOne = document.querySelector('#message-1')

//Seleciona el elemento p con id message-2
const messageTwo = document.querySelector('#message-2')

//Se agrega un evento para cuando se envíe el formulario
weatherForm.addEventListener('submit', (e) => {
    //Evita la recarga de la página al enviar el formulario
    e.preventDefault()

    //Se extrae el valor del campo del input
    const address = search.value

    //Insertamos un mensaje de carga para el primer párrafo
    messageOne.textContent = 'Cargando...'
    
    //Limpiamos el contenido del segundo párrafo
    messageTwo.textContent = ''

    // Realiza una solicitud a la URL 'http://localhost:3000/weather?address=!' para obtener datos climáticos
    fetch('http://localhost:3000/weather?address=' + address).then((response) => {
        response.json().then((data) => {
            //Validamos si obtenemos un error en los datos recibidos
            if (data.error) {
                //Insertamos el error obtenido dentro del primer párrafo
                messageOne.textContent = data.error
            }
            //Si no obtenemos errores en los datos recibidos
            else {
                //Insertamos la ubicación obtenida dentro del primer párrafo
                messageOne.textContent = data.location

                //Insertamos el pronóstico obtenido dentro del segundo párrafo
                messageTwo.textContent = data.forecast
            }
        })
    })
})