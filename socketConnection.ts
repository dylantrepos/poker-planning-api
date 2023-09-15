  import http from 'http';
import { Server } from 'socket.io';

import socketOnEvents from './socket/onEvents';
import { client, getUserList, getVotes, removeUserFromList } from './redis/redis';

import type { Socket, ServerType } from './types/SocketType';

export let ioElt: ServerType;

export const init = (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
    ioElt = new Server(server, { cors: { origin: '*' }});

    ioElt.on('connection', ( socket ) => {
      socketOnEvents(socket);

      /**
       * Disconnnection
       */
      socket.on('disconnect', async () =>  await disconnectFromRoom(socket));
    })


    return ioElt;
};

const disconnectFromRoom = async ( socket: Socket ) => {
  console.log(`\n[CONNEXION] user ${socket.id} disconnected`);

  const { userId, roomId } = socket.data;
  const roomUsers = await ioElt.in(roomId).fetchSockets();

  // If no user in room anymore
  if (roomUsers.length === 0) {
    client.del(`${roomId}:messages`);
    client.del(`${roomId}:lead`);
    client.del(`${roomId}:userList`);
    client.del(`${roomId}:votes`);
    client.del(`${roomId}:voteState`);

    return;
  } 

  await removeUserFromList(roomId, userId);
  const userList = await getUserList(roomId);

  ioElt.to(roomId).emit('userList:update', userList);
}

const checkIoExists = (): void => {
  if (!ioElt) {
    throw new Error("must call .init(server) before you can call .getio()");
  }
}
export const getio = () => {
    checkIoExists();
    
    return ioElt;
}


export const getAllSockets = () => {
    checkIoExists();
    return ioElt.sockets.sockets;
}
