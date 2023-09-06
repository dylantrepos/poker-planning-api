import { Request, Response } from "express";
import { Socket } from "socket.io";
import { SocketsType } from "./types/SocketType";

import express from 'express';
import http from 'http';
import cors from 'cors';
import socketController from './socket/controller';
import { getRoomList } from "./utils/utils";
import { getUsersInRoom } from "./socket/connexion";

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

        const users = await getUsersInRoom(socket.data.roomId);
    
        socket.to(socket.data.roomId).emit('update-userList', users);
    })
})

// Routes
app.get('/', (req: Request, res: Response) => res.send({ 
    message: 'Hello World!'
}));

app.get('/check/:roomId', (req: Request, res: Response) => 
    res.send({exist: io.sockets.adapter.rooms.has(req.params.roomId)}
));

app.get('/user-list/:roomId', async (req: Request, res: Response) => 
    res.send({
        list: (await io.in(req.params.roomId).fetchSockets())
            .map((socket: any) => ({
                userId: socket.data.userId,
                username: socket.data.username,
            }))
        }
));

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
