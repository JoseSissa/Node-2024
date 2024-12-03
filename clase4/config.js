// SECRET_JWT_KEY
// Procurar en el archivo .env y mucho más robusto que 'secret'
export const {
    PORT = 3000, 
    SALT_ROUNDS = 4 ,
    SECRET_JWT_KEY = 'secret'
} = process.env