import http from 'http';
import { Socket } from 'socket.io';
import socketController from './socket/controller';
import { getUsersInRoom } from './socket/connexion';
import { client } from './redis/redis';
import { User } from './types/UserType';

let ioElt: any;
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

        if (socket.data.roomId) {
          const roomUsers = (await ioElt.in(socket.data.roomId).fetchSockets());
          if (roomUsers.length === 0) {
            await client.del(`${socket.data.roomId}:userList`);
            await client.del(`${socket.data.roomId}:messages`);
          } else {
            let userListRedis = await client.sMembers(`${socket.data.roomId}:userList`);
            let userList: any[] = userListRedis.map(user => JSON.parse(user));
            const checkUserStillAlive = roomUsers.find((socketEl: Socket) => 
              socketEl.data.userId === socket.data.userId
            )
            
            if (!checkUserStillAlive) {
              userList.forEach(user => {
                if (user.userId === socket.data.userId) user.connected = false
              })
              
              await client.del(`${socket.data.roomId}:userList`);
    
              for (const user of userList) {
                await client.sAdd(`${socket.data.roomId}:userList`, JSON.stringify(user));
              }
    
              userList = userList.filter(user => user.connected = true);
    
              ioElt.to(socket.data.roomId).emit('userList:update', userList);
          }
          }
        }
      })
    })


    return ioElt;
};

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
    
    return ioElt.sockets;
}
