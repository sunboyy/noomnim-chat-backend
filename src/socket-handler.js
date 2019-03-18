import socketIO from 'socket.io';
import { getClient, insertClient } from './models/client';
import { getMembership, addMembership } from './models/member';

let io;

export function initSocket(http) {
  io = socketIO(http);
  io.on('connection', socket => {
    socket.emit('greet', 'Hello, a new client!');
    console.log(socket.id + ': Connected');

    socket.on('greet', msg => {
      console.log('' + socket.id + ' [greet]: ' + msg + '');
    });

    socket.on('create-client', async msg => {
      try {
        let client = await getClient(msg);
        if (!client) {
          client = await insertClient(msg);
        }
        const groups = await getMembership(client.id);
        groups.forEach(group => socket.join('group/' + group.id));
        socket.emit('create-client', { data: { client, groups } });
      } catch (e) {
        socket.emit('create-client', { error: e });
      }
    });

    socket.on('join-group', async (name, groupId) => {
      try {
        const client = await getClient(name);
        if (!client) {
          socket.emit('join-group', { error: 'Create client first!' });
        }
        if (!checkMembership(clientId, groupId)) {
          await addMembership(clientId, groupId);
        }
        socket.join('group/' + groupId);
      } catch (e) {
        console.error(e);
        socket.emit('join-group', { error: e });
      }
    });
  });
}

export function pushToGroup(groupId, message) {
  io.to('group/' + groupId).emit('message', { data: message });
}
