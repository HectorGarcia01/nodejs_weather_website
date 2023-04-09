//Cargamos el módulo path para trabaja con rutas de archivos
const path = require('path')

//Cargamos el módulo express para crear un sevidor web
const express = require('express')

//Cargamos el módulo hbs para renderizar vistas dinámicas con Handlebars
const hbs = require('hbs')

//Cargamos la función geocode del archivo geocode.js
const geocode = require('./utils/geocode')

//Cagamos la función forecast del archivo forecast.js
const forecast = require('./utils/forecast')

//Definimos una instancia para Express
const app = express()

//Definimos el puerto que vamos a utilizar
const port = process.env.PORT || 3000

//Definimos la ruta al directorio public para los recursos estáticos
const publicDirectoryPath = path.join(__dirname, '../public')

//Definimos una nueva ruta al directorio views para las vistas dinámicas
const viewsPath = path.join(__dirname, '../templates/views')

//Definimos la ruta al directorio partials para los componentes reutilizables
const partialsPath = path.join(__dirname, '../templates/partials')

//Establecemos el motor de plantillas como hbs
app.set("view engine", 'hbs')

//Establecemos la nueva ruta al directorio views para vistas dinámicas
app.set('views', viewsPath)

//Configurar Handlebars para registrar el directorio partials
hbs.registerPartials(partialsPath)

//Configuramos el servidor para servir directorios estáticos
app.use(express.static(publicDirectoryPath))

//Configuramos la ruta raíz
app.get('', (req, res) => {
    //Renderizamos el archivo index.hbs
    res.render('index', {
        //Configuramos una propiedad para el titulo
        title: "Aplicación meteorológica",
        //Configuramos una propiedad para el nombre del creador
        name: "Hector García"
    })
})

//Configuramos la ruta about
app.get('/about', (req, res) => {
    //Renderizamos el archivo about.hbs
    res.render('about', {
        //Configurmaos la propiedad para el titulo
        title: "Acerca de",
        //Configuramos la propiedad para el nombre del creador
        name: "Hector García"
    })
})

//Configuramos la ruta help
app.get('/help', (req, res) => {
    //Renderizamos el archivo help.hbs
    res.render('help', {
        //Configuramos la propiedad para el titulo
        title: 'Ayuda',
        //Configuramos una propiedad para el texto de ayuda
        helpText: "Este es un texto de ayuda.",
        //Configuramos una propiedad para el nombre del creador
        name: "Hector García"
    })
})

//Configuramos la ruta weather
app.get('/weather', (req, res) => {
    //Verificamos si el usuario no proporcionó una dirección
    if (!req.query.address) {
        //Retornamos una respuesta con el error
        return res.send({
            //Configuramos una propiedad para el error
            error: "Debe proporcionar una dirección!"
        })
    }

    //Mandamos la dirección a la función geocode y accedemos a los datos del callback
    geocode(req.query.address, (error, { location, latitude, longitude } = {}) => {
        //Validamos si recibimos un error
        if (error) {
            //Retornamos una respuesta con el error
            return res.send({ error })
        }

        //Mandamos las coordenadas (latitud y longitud) y accedemos a los datos del callback
        forecast(latitude, longitude, (error, forecastData) => {
            //Validamos si recibimos un error
            if (error) {
                //Retornamos una respuesta con el error
                return res.send({ error })
            }

            //Enviamos una respuesta con los datos del pronóstico
            res.send({
                //Configuramos una propiedad para el pronóstico
                forecast: forecastData,
                //Configuramos una propiedad para la ubicación
                location,
                //Configuramos una propiedad para la dirección
                address: req.query.address
            })
        })
    })
})

//Configuramos la ruta products
app.get('/products', (req, res) => {
    //Verificamos si el usuario no proporcionó un término de búsqueda
    if (!req.query.search) {
        //Retornamos una respuesta con el error
        return res.send({
            //Configuramos una propiedad para el error
            error: "Debe proporcionar un término de búsqueda!"
        })
    }
    console.log(req.query)
    //Si el usuario proporcionó un término de busca enviamos los productos
    res.send({
        //Configuramos una propiedad para los productos
        products: []
    })
})

//Configuramos un manejo de rutas inexistentes de la sección de ayuda
app.get('/help/*', (req, res) => {
    //Renderizamos el archivo page404.hbs
    res.render('404', {
        //Configuramos la propiedad para el título
        title: '404',
        //Configuramos la propiedad para el mensaje de error
        errorMessage: "Artículo de ayuda no encontrado.",
        //Configuramos la propiedad para el nombre del creador
        name: "Hector García"
    })
})

//Configuramos un manejo de rutas inexistentes
app.get('*', (req, res) => {
    //Renderizamos el archivo page404.hbs
    res.render('404', {
        //Configuramos la propiedad para el título
        title: '404',
        //Configuramos la propiedad para el mensaje de error
        errorMessage: "Página no encontrada.",
        //Configuramos una propiedad para el nombre del creador
        name: "Hector García"
    })
})

//Iniciamos el servidor en el puerto 3000
app.listen(port, () => {
    console.log("El servidor se inició en http://localhost:3000/")
})