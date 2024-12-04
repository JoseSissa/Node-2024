import express from 'express'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)  
        req.session.user = data
    } catch (error) {
        req.session.user = null
    }

    next() // Seguir a la sgte ruta o middleware
})

app.get('/', (req, res) => {
    const { user } = req.session
    res.render('index', { user })
})

// Register
app.post('/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const id = await UserRepository.create({ username, password })
        res.send({ id })
    } catch (error) {
        // Normalmente no se debería enviar el error al cliente
        res.status(400).send(error.message)
    }
})

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body    

    try {
        const user = await UserRepository.login({ username, password })
        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_JWT_KEY,
            { expiresIn: '1h' }
        )
        res
            .cookie('access_token', token, 
                { 
                    httpOnly: true, // La cookie solo se puede acceder en el servidor
                    secure: process.env.NODE_ENV === 'production', // Solo se puede acceder en producción con HTTPS
                    sameSite: 'strict', // La cookie solo se puede desde el mismo dominio
                    maxAge: 1000 * 60 * 60 // La cookie expira en 1 hora
                })
            .send({ user, token })
    } catch (error) {
        // Normalmente no se debería enviar el error al cliente
        res.status(401).send(error.message)
    }
})


app.post('/logout', (req, res) => {
    console.log('hols logout');
    
    res
        .clearCookie('access_token')
        .json({ message: 'Logged out' })
        .redirect('/')
});

app.get('/protected', (req, res) => {
    const { user } = req.session
    if (!user) return res.status(403).send('Access denied')        
    res.render('protected', { user })
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})