import { Socket } from "socket.io";
import { addUserToGameRoom, sendMessageToGameRoom, logoutFromGameRoom } from "./functions";

export default ( socket: Socket ): void => {
    socket.on('join game', (data) => addUserToGameRoom(data, socket));

    socket.on('chat message', (data) => sendMessageToGameRoom(data));

    socket.on('disconnect', () => logoutFromGameRoom(socket.id))
}
