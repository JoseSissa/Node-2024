const { readFile } = require('node:fs/promises');

async function main() {
    console.log('Leyendo el primer archivo...');
    const data1 = await readFile('./sincronia/archivo1.txt', 'utf8');
    console.log('PRIMER TEXTO:', data1);

    console.log('Continúo haciendo mis cosas...');

    console.log('Leyendo el segundo archivo...');
    const data2 = await readFile('./sincronia/archivo2.txt', 'utf8');
    console.log('SEGUNDO TEXTO:', data2);
}

main();