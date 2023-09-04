import { UserMessageType } from "../types/SocketType";
import { mySocket } from "../server";

// Send a message to user
export const sendMessageToGameRoom = (userMessage: UserMessageType) => {
    mySocket[userMessage.gameId].usersSocket.forEach(socketElt => {
        socketElt.socket.emit(userMessage.gameId, {
            name: userMessage.name,
            message: userMessage.message
        })
    })
}