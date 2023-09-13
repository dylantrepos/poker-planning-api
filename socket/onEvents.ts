import { closeVoteToRoom, joinRoom, openVoteToRoom, sendMessageToRoom, sendNewLead, sendVoteToRoom } from "./emitEvents";

import type { Socket } from "../types/SocketType";

export default ( socket: Socket ): void => {
    socket.on('room:join', (userInfo) => joinRoom(socket, userInfo));
    
    socket.on('message:create', (userMessage) => sendMessageToRoom(userMessage));

    socket.on('vote:create', (vote) => sendVoteToRoom(vote));

    socket.on('vote:close', (roomId) => closeVoteToRoom(roomId));

    socket.on('vote:open', (roomId) => openVoteToRoom(roomId));

    socket.on('lead:update', (leadInfo) => sendNewLead(leadInfo));
}
