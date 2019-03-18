import socketIO from 'socket.io'
import { getClient, insertClient } from './models/client'
import { getMembership } from './models/member'
import { leaveGroup } from './models/group'

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
                const groups = await getMembership(client.id)
                groups.forEach(group => socket.join('group/' + group.id))
                socket.emit('create-client', { data: { client, groups } })
            } catch (e) {
                socket.emit('create-client', { error: e })
            }
        })

        socket.on('leave-group', async (msg) => {
            try {
                const clientId = msg.clientId
                const groupId = msg.groupId
                await leaveGroup(clientId,groupId)
                socket.emit('leave-group',{ data: { clientId, groupId } })
                socket.leave('group/' + groupId)
            } catch (e){
                socket.emit('leave-group', { error: e })
            }
        })
    })
}

export function pushToGroup(groupId, message) {
    io.to('group/' + groupId).emit('message', { data: message })
}
