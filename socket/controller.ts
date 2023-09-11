import { closeVoteToRoom, joinRoom, openVoteToRoom, sendMessageToRoom, sendNewLead, sendVoteToRoom } from "./connexion";

import type { Socket } from "../types/SocketType";

export default ( socket: Socket ): void => {
    socket.on('room:join', (userInfo) => joinRoom(socket, userInfo));
    
    socket.on('message:create', (userMessage) => sendMessageToRoom(userMessage));

    socket.on('vote:create', (vote) => sendVoteToRoom(vote));

    socket.on('vote:close', (voteInfo) => closeVoteToRoom(voteInfo));

    socket.on('vote:open', (voteInfo) => openVoteToRoom(voteInfo));

    socket.on('lead:update', (leadInfo) => sendNewLead(leadInfo));
}
