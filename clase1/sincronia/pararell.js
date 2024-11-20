import { readFile } from "node:fs/promises";

Promise.all([
    readFile('./sincronia/archivo1.txt', 'utf8'),
    readFile('./sincronia/archivo2.txt', 'utf8')
]).then(([data1, data2]) => {
    console.log('PRIMER TEXTO:', data1);
    console.log('SEGUNDO TEXTO:', data2);
}).catch((err) => {
    console.error('Error:', err);
});