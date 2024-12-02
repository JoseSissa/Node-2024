import dbLocal from "db-local";
const { Schema } = new dbLocal({ path: "./db" });
import crypto from 'node:crypto'

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
})

export class UserRepository {
    static create({ username, password }) {
        // 1. Validaciones del username (opcional usar zod)
        if (typeof username !== 'string' || username.length < 3) {
            throw new Error('Username must be a string with at least 3 characters')
        }
        if (typeof password !== 'string' || password.length < 6) {
            throw new Error('Password must be a string with at least 6 characters')
        }

        // 2. Asegurarse de que el usuario no existe
        const user = User.findOne({ username })
        if (user) throw new Error('Username already exists')

        const id = crypto.randomUUID()

        User.create({ _id: id, username, password }).save()
        return id
    }
    static login({ username, password }) {

    }
}