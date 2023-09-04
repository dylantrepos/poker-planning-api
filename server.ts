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
const io = require('socket.io')(server, { cors: { origin: '*' }});

io.on('connection', ( socket: Socket ) => socketElt(socket))

// Routes
app.get('/', (req: Request, res: Response) => res.send({ message: 'Hello World!' }));

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

export const mySocket: SocketsType = {};