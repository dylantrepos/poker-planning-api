import { Socket } from "socket.io";
import { AddUserType } from "../types/UserType";
import { SocketsType, UserMessageType } from "../types/SocketType";

const sockets: SocketsType = {};

// Add new user to a socket room
export const addUserToGameRoom = (userInfo: AddUserType, socket: Socket) => {
    console.log('join game : ', userInfo.gameId);

    if (sockets.hasOwnProperty(userInfo.gameId)) {
        sockets[userInfo.gameId].usersSocket.push({id: socket.id, socket});
    } else {
        sockets[userInfo.gameId] = {
            usersSocket: [{
                id: socket.id,
                socket
            }]
        };
    }
}

// Send a message to user
export const sendMessageToGameRoom = (userMessage: UserMessageType) => {
    sockets[userMessage.gameId].usersSocket.forEach(socketElt => {
        socketElt.socket.emit(userMessage.gameId, {
            name: userMessage.name,
            message: userMessage.message
        })
    })
}

// Remove user from sockets list if disconnected
export const logoutFromGameRoom = (socketId: string) => {
    for (const key in sockets) {
        sockets[key].usersSocket = sockets[key].usersSocket.filter(user => user.id !== socketId);
    }
}