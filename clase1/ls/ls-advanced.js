const fs = require('node:fs');
const path = require('node:path');

// la posición 0 es node
// la posición 1 es el fichero
const folder = process.argv[2] ?? '.';

fs.readdir(folder, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio:', err);
        process.exit(1);
    }
    
    files.forEach((file) => {
        const filePath = path.join(folder, file);
        // console.log(filePath);
        console.log(file);
        
        fs.stat(filePath, (err, result) => { // <-- stat nos da la información del archivo
            if (err) {
                console.error('Error al leer el archivo:', err);
                process.exit(1);
            }
            let stats = result;
            // console.log(stats);
            const isDirectory = stats.isDirectory()
            const fileType = isDirectory ? 'Directory' : 'File'
            const fileSize = stats.size
            const fileModified = stats.mtime.toLocaleString()
            console.log(`${fileType} ${file.padEnd(20)}: ${filePath.padEnd(20)} (${fileSize.toString().padStart(0)} bytes, Modified: ${fileModified})`);
        })        
    });
});

