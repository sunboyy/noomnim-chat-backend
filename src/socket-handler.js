import socketIO from 'socket.io'

let io

export function initSocket(http) {
    io = socketIO(http)
    io.on('connection', socket => {
        socket.emit('greet', 'Hello, A new client!')
        console.log('a client connected')
        socket.on('greet', msg => {
            console.log('A client "' + socket.id + '" says "' + msg + '".')
        })
    })
}
