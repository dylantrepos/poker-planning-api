import { Socket } from "socket.io";
import { closeVoteToRoom, joinRoom, openVoteToRoom, sendMessageToRoom, sendNewLead, sendVoteToRoom } from "./connexion";

export default ( socket: Socket ): void => {
    socket.on('room:join', (data) => joinRoom(socket, data));
    
    socket.on('message:create', (data) => sendMessageToRoom(data));

    socket.on('vote:create', (data) => sendVoteToRoom(data));

    socket.on('vote:close', (data) => closeVoteToRoom(data));

    socket.on('vote:open', (data) => openVoteToRoom(data));

    socket.on('lead:update', (data) => sendNewLead(data));
}
