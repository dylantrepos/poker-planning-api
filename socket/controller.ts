import { Socket } from "socket.io";
import { createRoom,  joinRoom, sendMessageToRoom } from "./connexion";
import { updateUserList } from "./user";

export default ( socket: Socket ): void => {
    socket.on('create-room', (data) => createRoom(data, socket));

    socket.on('join-room', (data) => joinRoom(data, socket));

    socket.on('update-userList', (data) => updateUserList(data))

    socket.on('chat-message', (data) => sendMessageToRoom(data, socket));
}
