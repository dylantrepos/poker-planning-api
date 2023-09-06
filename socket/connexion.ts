import { Socket } from "socket.io";
import { AddUserType } from "../types/UserType";
import { io, mySocket } from "../server";

const getRoomList = () => {
    console.log('\n[ROOMS] rooms available : ', io.sockets.adapter.rooms);
}

export const createRoom = (userInfo: AddUserType, socket: Socket) => {
    socket.join(userInfo.gameId);

    console.log(`\n[CREATE] Room created : {${userInfo.gameId}}`);
    console.log(`\n[JOIN] User {${userInfo.username}} join room : {${userInfo.gameId}}`);
}

export const joinRoom = (userInfo: AddUserType, socket: Socket) => {
    console.log('joining..', userInfo);

    getRoomList();
    
    socket.join(userInfo.gameId);

    // Emit to all with io.room(idroom).emit('new user)
    console.log(`\n[JOIN] User ${userInfo.username} join room : ${userInfo.gameId}`);
}




// Add new user to a socket room
export const addUserToGameRoom = (userInfo: AddUserType, socket: Socket) => {
    if (mySocket.hasOwnProperty(userInfo.gameId)) {
        console.log('\n[JOIN] join GAME : ', {userInfo, status: 'user'});

        mySocket[userInfo.gameId].push({
            socketId: socket.id, 
            userId: userInfo.userId, 
            status: 'user', 
            username: userInfo.username,
            socket
        });
    }
}

// Remove user from sockets list if disconnected
export const logoutFromGameRoom = (socketId: string) => {
    console.log(`\n[CONNEXION] user ${socketId} disconnected`);
    getRoomList();
    
    for (const key in mySocket) {
        mySocket[key] = mySocket[key].filter(user => user.socketId !== socketId);
    }
}