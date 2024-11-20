const http = require('node:http')

const server = http.createServer((req, res) => {
    console.log("Request received");
    res.end("<h1>Hello World</h1>");
})

// Con el puerto 0 se asigna un puerto disponible automáticamente, el primero que encuentre
// server.listen(0, () => {
//     console.log("Server is listening on port " + `http://localhost:${server.address().port}`);
// })


// net es un médulo que nos permite hacer conexiones TCP/IP, como el HTTP pero de forma más rápida
const net = require('node:net');

function findAvailablePort (desiredPort) {
    return new Promise((resolve, reject) => {
        const server = net.createServer()

        server.listen(desiredPort, () => {
            const { port } = server.address()
            server.close(() => {
                resolve(port) //<--- Esto es como un return
            })
        })

        server.on('error', (err) => {
            if(err.code === 'EADDRINUSE') {
                findAvailablePort(0).then(port => resolve(port))
            } else {
                reject(err)
            }
        })
    })
}

findAvailablePort(65535).then(port => {
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
})

module.exports = { findAvailablePort } 