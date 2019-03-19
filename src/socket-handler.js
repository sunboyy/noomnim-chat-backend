import socketIO from 'socket.io'
import { getClientById, getClientByName, insertClient } from './models/client'
import {
    getMembership,
    updateLastMessage,
    getLastMessageId,
    addMembership,
    checkMembership
} from './models/member'
import { leaveGroup, getGroup, insertGroup, getGroupById } from './models/group'
import { getUnreadMessage } from './models/message'

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
         * @event join-group
         * @description Request join group
         * @param msg (object) in the format {clientId, groupId}
         */
        socket.on('join-group', async msg => {
            const {clientId, groupId} = msg
            try {
                const client = await getClientById(clientId)
                if (!client) {
                    return socket.emit('join-group', {
                        error: 'Create client first!'
                    })
                }
                const group = await getGroupById(groupId)
                if(!group) {
                    return socket.emit('join-group', {
                        error: 'No group found!'
                    })
                }
                if (!(await checkMembership(client.id, group.id))) {
                    await addMembership(client.id, group.id)
                    socket.emit('join-group', {data: {group}})
                }
                socket.join('group/' + group.id)
            } catch (e) {
                console.error(e)
                socket.emit('join-group', { error: e })
            }
        })

        /**
         * @event create-client
         * @description Login request from client.
         * @param msg (string) desired client name
         */
        socket.on('create-client', async msg => {
            try {
                let client = await getClientByName(msg)
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
         * @event leave-group
         * @description leave group from client.
         * @param msg {clientId:int, groupId:int}
         */

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
        /**
         * @event message-ack
         * @description Message acknowledgement event from client to update `member`.`last_msg_id`
         * @param msg (object) in the format { clientId, groupId, messageId }
         */
        socket.on('message-ack', async msg => {
            if (typeof msg == 'string') {
                msg = JSON.parse(msg)
            }
            try {
                await updateLastMessage(
                    msg.clientId,
                    msg.groupId,
                    msg.messageId
                )
            } catch (e) {
                socket.emit('message-ack', { error: e })
            }
        })

        /**
         * @event create-group
         * @description group ceration request.
         * @param msg (object) in the format { name, clientId }
         */
        socket.on('create-group', async msg => {
            try {
                let group = await getGroup(msg.name)
                let clientId = msg.clientId
                if (group) {
                    socket.emit('create-group', {
                        error: 'the group is already exist'
                    })
                } else {
                    group = await insertGroup(msg.name)
                    await addMembership(clientId, group.id)
                    socket.emit('create-group', { data: group })
                    socket.join('group/' + group.id)
                }
            } catch (e) {
                socket.emit('create-group', { error: e })
            }
        })

        /**
         * @event get-unread
         * @description Get unread message
         * @param msg (object) in the format { clientId, groupId }
         */
        socket.on('get-unread', async msg => {
            if (typeof msg == 'string') {
                msg = JSON.parse(msg)
            }
            const lastMessageId = await getLastMessageId(
                msg.clientId,
                msg.groupId
            )
            const messages = await getUnreadMessage(msg.groupId, lastMessageId, ['posted_by'])
            messages.forEach(message => {
                socket.emit('message', { data: message })
            })
        })
    })
}

export function pushToGroup(groupId, message) {
    io.to('group/' + groupId).emit('message', { data: message })
}
