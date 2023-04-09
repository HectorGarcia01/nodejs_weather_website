//Cargamos el módulo request
const request = require('request')

//Definimos un diccionario con la traducción de la descripción del clima
const traduccion = {
    'Partly cloudy': 'Parcialmente nublado',
    'Overcast': 'Nublado',
    'Cloudy': 'Nublado',
    'Sunny': 'Soleado',
    'Clear': 'Despejado',
    'Mist': 'Neblina',
    'Haze': 'Neblina',
    'Fog': 'Neblina',
    'Rain': 'Lluvia',
    'Light Drizzle, Mist': 'Llovizna',
    'Snow': 'Nieve',
    'Thunderstorm': 'Tormenta'
}

//Definimos la función para el pronóstico
const forecast = (latitude, longitude, callback) => {
    //Asignamos la URL de la API weatherstack con las coordenadas recibidas
    const url = 'http://api.weatherstack.com/current?access_key=2136af691988287d5fcb91ae509b5786&query=' + latitude + ',' + longitude + '&units=f'

    //Realizamos la solicitud HTTP
    request({ url, json: true }, (error, { body }) => {
        //Validamos si obtenemos un error durante la solicitud HTTP
        if (error) {
            //Devolvemos un mensaje de error en caso de no tener acceso a internet
            callback("¡No se puede conectar al servicio meteorológico!", undefined)
        }
        //Validamos si obtenemos un error en la entrada del usuario
        else if (body.error) {
            //Devolvemos un mensaje de error en caso de tener alguna falla en la entrada del usuario
            callback("No se puede encontrar la ubicación.", undefined)
        }
        //En caso de no tener ningún error
        else {
            //Obtenemos los datos de la propiedad current
            const current_response = body.current

            //Traducimos la descripción del clima
            const weather_description = traduccion[current_response.weather_descriptions[0]] || current_response.weather_descriptions[0]

            //Devolvemos el pronóstico de las coordenadas obtenidas
            callback(undefined, weather_description + ". Actualmente está a " + current_response.temperature + " grados. Se siente como a " + current_response.feelslike + " grados. La humedad es de " + current_response.humidity + "%.")
        }
    })
}

module.exports = forecast