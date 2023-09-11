import { Socket } from "socket.io";
import { joinRoom, sendMessageToRoom, sendVoteToRoom } from "./connexion";

export default ( socket: Socket ): void => {
    socket.on('room:join', (data) => joinRoom(socket, data));
    
    socket.on('message:create', (data) => sendMessageToRoom(data));

    socket.on('vote:create', (data) => sendVoteToRoom(data));
}
