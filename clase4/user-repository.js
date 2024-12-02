import crypto from 'node:crypto'

import dbLocal from "db-local";
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'
const { Schema } = new dbLocal({ path: "./db" });

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
})

export class UserRepository {
    // Register
    static async create({ username, password }) {
        // 1. Validaciones del username (opcional usar zod)
        Validations.username(username)
        Validations.password(password)

        // 2. Asegurarse de que el usuario no existe
        const user = User.findOne({ username })
        if (user) throw new Error('Username already exists')

        const id = crypto.randomUUID()
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        User.create({ _id: id, username, password: hashedPassword }).save()
        return id
    }
    
    // Login
    static async login({ username, password }) {
        Validations.username(username)
        Validations.password(password)

        const user = User.findOne({ username })
        if (!user) throw new Error('Username not found')

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('Invalid password')

        const publicUser = {
            username: user.username
        }

        return publicUser
    }
}

class Validations {
    static username(username) {
        if (typeof username !== 'string' || username.length < 3) {
            throw new Error('Username must be a string with at least 3 characters')
        }
    }

    static password(password) {
        if (typeof password !== 'string' || password.length < 6) {
            throw new Error('Password must be a string with at least 6 characters')
        }
    }
}