import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
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
        res.send({ user })
    } catch (error) {
        // Normalmente no se debería enviar el error al cliente
        res.status(401).send(error.message)
    }
})


app.post('/logout', (req, res) => { })

app.post('/protected', (req, res) => { })

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})