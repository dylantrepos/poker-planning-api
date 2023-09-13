  import http from 'http';
import { Server } from 'socket.io';

import socketOnEvents from './socket/onEvents';
import { client } from './redis/redis';

import type { Socket, ServerType } from './types/SocketType';
import { getUsersInRoom } from './utils/utils';

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
  const leadCurr = await client.get(`${roomId}:lead`) ?? userId;
  const isLead = leadCurr === userId;

  // If no user in room anymore
  if (roomUsers.length === 0) {
    client.del(`${userId}:message`);
    client.del(`${userId}:lead`);
    client.del(`${userId}:userList`);

    return;
  } 

  // Check if user leaving is lead and is still connected
  if (
    isLead && 
    !roomUsers.find((user: any) => user.data.userId === userId)
  ) {
      const newLeadId = roomUsers[0].data.userId;

      await client.set(`${roomId}:lead`, newLeadId)

      ioElt.to(roomId).emit('lead:update', newLeadId);
  }

  const userList = await getUsersInRoom(roomId);

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
