import { Socket } from "socket.io";
import { joinRoom, sendMessageToRoom } from "./connexion";
import { updateUserList } from "./user";

export default ( socket: Socket ): void => {
    socket.on('join-room', (data) => joinRoom(data, socket));

    socket.on('new-message', (data) => sendMessageToRoom(data, socket));
}
