import { Socket } from "socket.io";

type UserSocketType = {
    socketId: string;
    userId: string;
    status: 'lead' | 'user';
    username: string;
    socket: Socket;
}

export type UserMessageType = {
    gameId: string;
    username: string;
    message: string;
}

export type SocketsType = {
    [gameId: string]: {
        usersSocket: UserSocketType[]
    }
};