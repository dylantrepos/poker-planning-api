import { Socket } from "socket.io";
import { AddUserType } from "../types/UserType";
import { mySocket } from "../server";

// Add new user to a socket room
export const addUserToGameRoom = (userInfo: AddUserType, socket: Socket) => {
    if (mySocket.hasOwnProperty(userInfo.gameId)) {
        console.log('data : ', userInfo);
        mySocket[userInfo.gameId].usersSocket.push({
            socketId: socket.id, 
            userId: userInfo.userId, 
            status: 'user', 
            username: userInfo.username,
            socket
        });
    } else {
        mySocket[userInfo.gameId] = {
            usersSocket: [{
                socketId: socket.id,
                userId: userInfo.userId,
                status: 'lead',
                username: userInfo.username,
                socket
            }]
        };
    }
}

export const createGameRoom = (userInfo: AddUserType, socket: Socket) => {
    mySocket[userInfo.gameId] = {
        usersSocket: [{
            socketId: socket.id,
            userId: userInfo.userId,
            status: 'lead',
            username: userInfo.username,
            socket
        }]
    };

    console.log('new GAME : ', {userInfo, status: 'lead'});
}

// Remove user from sockets list if disconnected
export const logoutFromGameRoom = (socketId: string) => {
    for (const key in mySocket) {
        mySocket[key].usersSocket = mySocket[key].usersSocket.filter(user => user.socketId !== socketId);
    }
}