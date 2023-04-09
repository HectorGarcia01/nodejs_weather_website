//Cargamos el módulo request
const request = require('request')

//Definimos la función para la geocodificación
const geocode = (address, callback) => {
    //Asignamos la URL de la API mapbox de geocodificación con la dirección recibida
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiZ2FyY2lhaGVjdG9yMDEiLCJhIjoiY2xmaGRkMXk1MDUxMzNycWdrOW9nb25rciJ9.pUlEjo-hgUvztevDkkS-Fg&limit=1'

    //Realizamos la solicitud HTTP
    request({ url, json: true }, (error, { body}) => {
        //Validamos si obtenemos un error durante la solicitud HTTP
        if (error) {
            //Devolvmos un mensaje de error en caso de no tener acceso a internet
            callback("¡No se puede conectar al servidor de geocodificación!", undefined)
        }
        //Validamos si la propiedad features está vacía
        else if (body.features.length === 0) {
            //Devolvemos un mensaje de error en caso de no encontrar coordenadas para la dirección recibida
            callback("No se encontró la ubicación. Intenta con otra búsqueda.", undefined)
        }
        //En caso de no tener un error en la solicitud 
        else {
            //Devolvemos un objeto con los datos de la dirección recibida
            callback(undefined, {
                //Configuramos la propiedad para la ubicación
                location: body.features[0].place_name,
                //Configuramos la propiedad para la latitud
                latitude: body.features[0].center[1],
                //Configuramos la propiedad para la longitud
                longitude: body.features[0].center[0]
            })
        }
    })
}

module.exports = geocode