import http from 'http';
import { Socket } from 'socket.io';
import socketController from './socket/controller';
import { getUsersInRoom } from './socket/connexion';
import { client } from './redis/redis';
import { User } from './types/UserType';

export let ioElt: any;
let socketElt: any;

const checkIoExists = (): void => {
  if (!ioElt) {
    throw new Error("must call .init(server) before you can call .getio()");
  }
}

export const init = (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
    // start socket.io server and cache io value
    ioElt = require('socket.io')(server, { cors: { origin: '*' }});

    ioElt.on('connection', ( socket: Socket ) => {
      socketElt = socket;
      socketController(socket);
      
      // console.log(`\n[CONNEXION] User '${socket.id}' has connected`);

      /**
       * Disconnnection
       */
      socket.on('disconnect', async () => {
        console.log(`\n[CONNEXION] user ${socket.id} disconnected`);

        await disconnectFromRoom(socket);
      })
    })


    return ioElt;
};

const disconnectFromRoom = async (socket: Socket) => {
  const roomUsers = (await ioElt.in(socket.data.roomId).fetchSockets())

  // If no user in room anymore
  if (roomUsers.length === 0) {
    client.del(`${socket.data.id}:message`);
    return;
  } 


  // Check if user leaving is lead and is still connected
  if (
    socket.data.role === 'lead' && 
    !roomUsers.find((user: any) => user.data.userId === socket.data.userId)
  ) {
      const id = roomUsers[0].data.userId;
      
      roomUsers
        .filter((user: Socket) => user.data.userId === id)
        .forEach((user: Socket) => {
          user.data.role = 'lead'
        });

      await client.set(`${socket.data.roomId}:lead`, id)
      const lead = await client.get(`${socket.data.roomId}:lead`);

      ioElt.to(socket.data.roomId).emit('lead:update', lead);
  }

  const userList = await getUsersInRoom(socket.data.roomId);

  ioElt.to(socket.data.roomId).emit('userList:update', userList);
}

export const getio = () => {
    checkIoExists();
    
    return ioElt;
}

export const getSocket = () => {
    checkIoExists();

    return socketElt;
}

export const getAllSockets = () => {
    checkIoExists();
    return ioElt.sockets.sockets;
}
