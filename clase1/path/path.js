const path = require('node:path');

// barra separadora de carpetas según SO
console.log(path.sep);

//  unir rutas con path.join
const filePath = path.join('sincronia', 'archivo1.txt');
console.log(filePath);

// Nos retorna el nombre del fichero
const fileName = path.basename(filePath);
console.log(fileName);

// Nos retorna el nombre del fichero sin la extensión
const fileNameWithoutExtension = path.basename(filePath, '.txt');
console.log(fileNameWithoutExtension);

// Nos retorna la extensión del fichero
const extension = path.extname('my.super.image.jpg');
console.log(extension);
