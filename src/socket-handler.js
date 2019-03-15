import socketIO from 'socket.io'
import { getClient, insertClient } from './models/client'

let io

export function initSocket(http) {
    io = socketIO(http)
    io.on('connection', socket => {
        socket.emit('greet', 'Hello, a new client!')
        console.log(socket.id + ': Connected')

        socket.on('greet', msg => {
            console.log('' + socket.id + ' [greet]: ' + msg + '')
        })

        socket.on('create-client', async (msg) => {
            try {
                let client = await getClient(msg)
                if (!client) {
                    client = await insertClient(msg)
                }
                socket.emit('create-client', { data: client })
            } catch (e) {
                socket.emit('create-client', { error: e })
            }
        })
    })
}
