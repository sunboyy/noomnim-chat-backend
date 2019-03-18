import socketIO from 'socket.io'
import { getClient, insertClient } from './models/client'
import { getMembership, updateLastMessage } from './models/member'

let io

export function initSocket(http) {
    io = socketIO(http)
    io.on('connection', socket => {
        socket.emit('greet', 'Hello, a new client!')
        console.log(socket.id + ': Connected')

        socket.on('greet', msg => {
            console.log('' + socket.id + ' [greet]: ' + msg + '')
        })

        /**
         * @event create-client
         * @description Login request from client.
         * @param msg (string) desired client name
         */
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

        /**
         * @event message-ack
         * @description Message acknowledgement event from client to update `member`.`last_msg_id`
         * @param msg (object) in the format { clientId, groupId, messageId }
         */
        socket.on('message-ack', async (msg) => {
            if (typeof msg == 'string') {
                msg = JSON.parse(msg)
            }
            try {
                await updateLastMessage(msg.clientId, msg.groupId, msg.messageId)
            } catch (e) {
                socket.emit('message-ack', { error: e })
            }
        })

        socket.on('create-group', async (msg) => {
            try {

                let group = await getGroup(msg)
                if (group) {
                    socket.emit('create-group', { error: 'the group is already exist' })
                } else {
                    group = await insertGroup(msg)
                    socket.emit('create-group', { data: group })
                    socket.join('group/' + group.id);
                }
            } catch (e) {
                socket.emit('create-group', { error: e })
            }
        })
    })
}

export function pushToGroup(groupId, message) {
    io.to('group/' + groupId).emit('message', { data: message })
}
