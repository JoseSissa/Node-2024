const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const desiredPort = process.env.PORT ?? 3000;
const pathImage = path.join(__dirname, 'imagen.png')


const processRequest = (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if(req.url === '/') {
        res.statusCode = 200; // OK
        res.end('<h1>Bienvenido a mi página web</h1>');
        fs.readFile
    } else if (req.url === '/about') {
        res.statusCode = 200; // OK
        res.end('<h1>Contacto</h1>');
    } else if (req.url === '/test-ruta-imagen.png') {
        fs.readFile(pathImage, (err, data) => {
            if (err) {
                res.statusCode = 500; // Internal Server Error
                res.end('<h1>Error Internal Server</h1>');
            } else {
                res.setHeader('Content-Type', 'image/png');
                res.statusCode = 200; // OK
                res.end(data);
            }
        });
    } else {
        res.statusCode = 404; // Not Found
        res.end('<h1>Página no encontrada</h1>');
    }
};

const server = http.createServer(processRequest);

// Con el puerto 0 se asigna un puerto disponible automáticamente, el primero que encuentre

server.listen(desiredPort, () => {    
    console.log(
        `Server is listening on port http://localhost:${server.address().port}`
    );    
});
