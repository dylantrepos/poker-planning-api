import { UserMessageType } from "../types/SocketType";
import { mySocket } from "../server";

// Send a message to user
export const sendMessageToGameRoom = (userMessage: UserMessageType) => {
    mySocket[userMessage.gameId].forEach(socketElt => {
        console.log('socket : ', socketElt);
        socketElt.socket.emit(userMessage.gameId, {
            username: userMessage.username,
            message: userMessage.message
        })
    })
}

export const updateUserList = ( gameId: string ) => {
    const userList = mySocket[gameId].map(socketElt => socketElt.username ?? 'null');

    mySocket[gameId].forEach(socketElt => {
        socketElt.socket.emit(`${gameId}-userList`, {
            userList
        })
    })
}