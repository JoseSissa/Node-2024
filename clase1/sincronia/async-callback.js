const fs = require('fs');

console.log('Leyendo el primer archivo...');
fs.readFile('./sincronia/archivo1.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error Archivo 1:', err, data);
        return;
    }
    console.log('PRIMER TEXTO:', data);
});

console.log('Continúo haciendo mis cosas...');

console.log('Leyendo el segundo archivo...');
fs.readFile('./sincronia/archivo2.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error Archivo 1:', err, data);
        return;
    }
    console.log('SEGUNDO TEXTO:', data);
});