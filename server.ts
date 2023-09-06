import { Request, Response } from "express";
import { Socket } from "socket.io";
import { SocketsType } from "./types/SocketType";

import express from 'express';
import http from 'http';
import cors from 'cors';
import socketElt from './socket/controller';

const PORT = 3000;
const app = express(); 

app.use(cors());

const server = http.createServer(app);
export const io = require('socket.io')(server, { cors: { origin: '*' }});
export const mySocket: SocketsType = {};

io.on('connection', ( socket: Socket ) => {
    console.log(`\n[CONNEXION] User '${socket.id}' has connected`);

    socketElt(socket);
})

// Routes
app.get('/', (req: Request, res: Response) => res.send({ 
    message: 'Hello World!'
}));

app.get('/check/:roomId', (req: Request, res: Response) => 
    res.send({exist: io.sockets.adapter.rooms.has(req.params.roomId)}
));

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
