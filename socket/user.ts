import { UserMessageType } from "../types/SocketType";
import { mySocket } from "../server";

// Send a message to user
export const sendMessageToGameRoom = (userMessage: UserMessageType) => {
    mySocket[userMessage.roomId].forEach(socketElt => {
        console.log('socket : ', socketElt);
        socketElt.socket.emit(userMessage.roomId, {
            username: userMessage.username,
            message: userMessage.message
        })
    })
}

export const updateUserList = ( roomId: string ) => {
    const userList = mySocket[roomId].map(socketElt => socketElt.username ?? 'null');

    mySocket[roomId].forEach(socketElt => {
        socketElt.socket.emit(`${roomId}-userList`, {
            roomId,
            userList
        })
    })
}