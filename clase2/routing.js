const http = require('node:http')
const desiredPort = process.env.PORT ?? 3000;
const fs = require('node:fs')

const dittoJSON = require('./pokemon/ditto.json')

// Funcion que procesa la solicitud
const processRequest = (req, res) => {
    const { method, url } = req;

    switch (method) {
        case 'GET':
            switch (url) {
                case '/':
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    res.statusCode = 200;
                    return res.end('<h1>Bienvenido a mi página web</h1>');

                case '/pokemon/ditton':
                    res.setHeader('Content-Type', 'aplication/json; charset=utf-8');
                    res.statusCode = 200;
                    return res.end(JSON.stringify(dittoJSON))

                default:
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    res.statusCode = 404;
                    return res.end('<h1>Página no encontrada GET</h1>');
            }
        case 'POST':
            switch (url) {
                case '/pokemon': {
                    let body = ''

                    // escuhamos el evento data
                    req.on('data', (chunk) => { // <-- chunk es un buffer
                        body += chunk.toString();
                    });

                    // Cuando el evento de recibir data termina, escucha el sgte evento
                    req.on('end', () => {
                        const data = JSON.parse(body);
                        data.timestamp = Date.now();
                        // Llamamos a una DB para guardar la info
                        res.writeHead(201, {
                            'Content-Type': 'application/json; charset=utf-8',
                        })
                        res.end(JSON.stringify(data));
                    })

                    break;
                }

                default:
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    res.statusCode = 404;
                    return res.end('<h1>Página no encontrada POST</h1>');
            }
    }
}

// Creación del servido
const server = http.createServer(processRequest);

server.listen(desiredPort, () => {
    console.log('Servidor listo en el puerto 3000');
});