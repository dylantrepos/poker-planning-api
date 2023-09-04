import { Socket } from "socket.io";

type UserSocketType = {
    id: string;
    socket: Socket
}

export type UserMessageType = {
    gameId: string;
    name: string;
    message: string;
}

export type SocketsType = {
    [gameId: string]: {
        usersSocket: UserSocketType[]
    }
};