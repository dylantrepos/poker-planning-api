import { Socket } from "socket.io";
import { createRoom, joinRoom, sendMessageToRoom, updateVote, sendVoteToRoom } from "./connexion";

export default ( socket: Socket ): void => {
    socket.on('room:create', (data) => createRoom(data));

    socket.on('room:join', (data) => joinRoom(data));
    
    socket.on('message:create', (data) => sendMessageToRoom(data));

    socket.on('vote:create', (data) => sendVoteToRoom(data));

    socket.on('update-vote', (data) => updateVote(data));
}
