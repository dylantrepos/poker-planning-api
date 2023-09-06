import { Socket } from "socket.io";
import { addUserToGameRoom, createRoom, joinRoom, logoutFromGameRoom } from "./connexion";
import { updateUserList, sendMessageToGameRoom } from "./user";

export default ( socket: Socket ): void => {
    socket.on('create-room', (data) => createRoom(data, socket));
    
    socket.on('join-room', (data) => joinRoom(data, socket));



    socket.on('join-game', (data) => addUserToGameRoom(data, socket));

    socket.on('update-userList', (data) => updateUserList(data))

    socket.on('chat-message', (data) => sendMessageToGameRoom(data));

    socket.on('disconnect', () => logoutFromGameRoom(socket.id))
}
