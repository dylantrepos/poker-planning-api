import { Request, Response } from "express";
import { Socket } from "socket.io";
import { SocketsType } from "./types/SocketType";

import express from 'express';
import http from 'http';
import cors from 'cors';
import socketController from './socket/controller';
import { getMessages, getUsersInRoom } from "./socket/connexion";

const PORT = 3000;
const app = express(); 

app.use(cors());

const server = http.createServer(app);
export const io = require('socket.io')(server, { cors: { origin: '*' }});
export const mySocket: SocketsType = {};

io.on('connection', ( socket: Socket ) => {
  console.log(`\n[CONNEXION] User '${socket.id}' has connected`);

  socketController(socket);

  socket.on('disconnect', async () => {
    console.log(`\n[CONNEXION] user ${socket.id} disconnected`);

    let userList = await getUsersInRoom(socket.data.roomId);
    
    if (socket.data.role === 'lead') {
      const roomUsers = (await io.in(socket.data.roomId).fetchSockets())

      if (roomUsers.length > 0 && !roomUsers.find((user: any) => user.data.userId === socket.data.userId)) {
        roomUsers[0].data.role = 'lead';
      }
    }
    userList = await getUsersInRoom(socket.data.roomId);

    socket.to(socket.data.roomId).emit('update-userList', {
      roomId: socket.data.roomId,
      userList
    });
  })
})

// Routes
app.get('/', (req: Request, res: Response) => res.send({ 
    message: 'Hello World!'
}));

app.get('/check/:roomId', (req: Request, res: Response) => {
    console.log('[ROOMS] Rooms availables : ', io.sockets.adapter.rooms);
    res.send({exist: io.sockets.adapter.rooms.has(req.params.roomId)});
});

app.get('/user-list/:roomId', async (req: Request, res: Response) => 
    res.send({
        list: (await io.in(req.params.roomId).fetchSockets())
            .map((socket: any) => ({
                userId: socket.data.userId,
                username: socket.data.username,
                role: socket.data.role,
                vote: socket.data.vote,
            }))
        }
));

app.get('/messages/:roomId', async (req: Request, res: Response) => 
    res.send({
        messages: await getMessages(req.params.roomId)
        }
));

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
