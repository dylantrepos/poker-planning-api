import { Socket } from "socket.io";

type UserSocketType = {
    status: 'lead' | 'user';
    socketId: string;
    userId?: string;
    username: string;
    socket: Socket;
}

export type UserMessageType = {
    roomId: string;
    username: string;
    message: string;
}

export type SocketsType = {
    [roomId: string]: UserSocketType[];
};