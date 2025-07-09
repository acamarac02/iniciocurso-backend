import express from 'express'
import colors from 'colors'
import profesoresRouter from './router/profesores-router'
import db from './config/db'
import cursosRouter from './router/cursos-router'

async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.green.bold("Conexión exitosa a la BD"))
    } catch (error) {
        console.log(error)
        console.log(colors.red.bold("Error al conectar a la base de datos"))
    }
}

connectDB()

const server = express()
server.use(express.json())

server.use('/api/profesores', profesoresRouter)
server.use('/api/cursos', cursosRouter)

export default server