import { Socket } from "socket.io";
import { addUserToGameRoom, logoutFromGameRoom } from "./connexion";
import { sendMessageToGameRoom } from "./user";

export default ( socket: Socket ): void => {
    socket.on('join game', (data) => addUserToGameRoom(data, socket));

    socket.on('chat message', (data) => sendMessageToGameRoom(data));

    socket.on('disconnect', () => logoutFromGameRoom(socket.id))
}
