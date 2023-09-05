import { UserMessageType } from "../types/SocketType";
import { mySocket } from "../server";

// Send a message to user
export const sendMessageToGameRoom = (userMessage: UserMessageType) => {
    mySocket[userMessage.gameId].usersSocket.forEach(socketElt => {
        console.log('socket : ', userMessage);
        socketElt.socket.emit(userMessage.gameId, {
            username: userMessage.username,
            message: userMessage.message
        })
    })
}