import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    // console.log(username, password)


    try {
        const id = UserRepository.create({ username, password })
        res.send({ id })
    } catch (error) {
        // Normalmente no se debería enviar el error al cliente
        res.status(400).send(error.message)
    }
})
app.post('/register', (req, res) => {
    const { username, password } = req.body

    try {
        const id = UserRepository.create({ username, password })
        res.send({ id })
    } catch (error) {
        // Normalmente no se debería enviar el error al cliente
        res.status(400).send(error.message)
    }
})
app.post('/logout', (req, res) => { })

app.post('/protected', (req, res) => { })

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})