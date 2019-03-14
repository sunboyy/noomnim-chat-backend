import express from 'express'
import socketIO from 'socket.io'
import { Server } from 'http'
import { port } from './config'

const app = express()
const http = Server(app)
const io = socketIO(http)

io.on('connection', socket => {
    console.log('Connected')
})

app.listen(port, () => {
    console.log('Noomnim Chat server started at port ' + port)
})
