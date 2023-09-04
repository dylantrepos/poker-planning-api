import { Socket } from "socket.io";
import { AddUserType } from "../types/UserType";
import { mySocket } from "../server";

// Add new user to a socket room
export const addUserToGameRoom = (userInfo: AddUserType, socket: Socket) => {
    if (mySocket.hasOwnProperty(userInfo.gameId)) {
        mySocket[userInfo.gameId].usersSocket.push({id: socket.id, socket});
    } else {
        mySocket[userInfo.gameId] = {
            usersSocket: [{
                id: socket.id,
                socket
            }]
        };
    }
}

// Remove user from sockets list if disconnected
export const logoutFromGameRoom = (socketId: string) => {
    for (const key in mySocket) {
        mySocket[key].usersSocket = mySocket[key].usersSocket.filter(user => user.id !== socketId);
    }
}