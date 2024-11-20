const express = require('express')
const app = express()

const dittoJSON = require('./pokemon/ditto.json')

app.disable('x-powered-by')

// MIDDELWARE
// Si no agrregamos parámetro (ruta) en antes del callback, se ejecutará para todas las solicitudes que reciba
// Podemos especificar a qué rutas puede afectar el middelware, en el sgte ejemplo, solo afecta a las rutas que empiecen por /pokemon
// app.use('/pokemon', (req, res, next) => {})
app.use((req, res, next) => {
    if (req.method !== 'POST') return next()
    if (req.headers['content-type'] !== 'application/json') return next()

    // Aquí sólo llegarían request que son POST y que tienen el header Content-type: application/json
    let body = ''
    // escuhamos el evento data
    req.on('data', chunk => { // <-- chunk es un buffer
        body += chunk.toString();
    });

    res.on('end', () => {
        const data = JSON.parse(body);
        data.timestamp = Date.now();
        // Llamamos a una DB para guardar la info
        // Mutar la request y meter la información en el req.body
        req.body = data
        next()
    })
})

const PORT = process.env.PORT ?? 3000

app.get('/', (req, res) => {
    // res.json({ hello: 'world' })
    res.send('<h1>Bienvenido a mi página web</h1>')
})

app.get('/pokemon/ditton', (req, res) => {
    // res.json({ hello: 'world' })
    res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
    res.status(201).json(req.body)
})

// Al poner .use nos aseguramos en que a cualquier ruta que no exista se redirija a la ruta 404
// Podemos usar .get, .post, .put, .delete, etc de acuerdo a cada método si queremos
app.use((req, res, next) => {
    res.status(404).send('<h1>Página no encontrada</h1>')
})

app.listen(PORT, () => {
    console.log(`Servidor listo en el puerto http://localhost:${PORT}`)
})