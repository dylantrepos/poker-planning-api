import { Socket } from "socket.io";
import { AddUserType } from "../types/UserType";
import { getRoomList } from "../utils/utils";
import { io } from "../server";

export const createRoom = async (userInfo: AddUserType, socket: Socket) => {
    socket.join(userInfo.roomId);
    socket.data.roomId = userInfo.roomId;
    socket.data.username = userInfo.username;
    socket.data.userId = userInfo.userId;

    // console.log(`\n[SOCKET] socket user : `, socket);
    console.log(`\n[CREATE] Room created : {${userInfo.roomId}}`);
    console.log(`\n[JOIN] User {${userInfo.username}} join room : {${userInfo.roomId}}`);

    const users = await getUsersInRoom(userInfo.roomId);
    
    socket.to(userInfo.roomId).emit('update-userList', users);
}

export const joinRoom = async (userInfo: AddUserType, socket: Socket) => {
    console.log('joining..', userInfo);
    
    getRoomList();
    
    socket.join(userInfo.roomId);
    socket.data.roomId = userInfo.roomId;
    socket.data.username = userInfo.username;
    socket.data.userId = userInfo.userId;
    console.log(`\n[JOIN] User ${userInfo.username} join room : ${userInfo.roomId}`);

    const users = await getUsersInRoom(userInfo.roomId);
    
    socket.to(userInfo.roomId).emit('update-userList', users);
}

export const sendMessageToRoom = async (userInfo: AddUserType, socket: Socket) => {
    console.log(`[MESSAGE] Message send by ${socket.data.username} : `, userInfo);

    socket.to(userInfo.roomId).emit(`${userInfo.roomId}-message`, userInfo);
}

export const getUsersInRoom = async (roomId: string) => {
    const roomUsers = (await io.in(roomId).fetchSockets())
        .map((socket: any) => ({
                userId: socket.data.userId,
                username: socket.data.username,
            }));

    console.log(`\n[ROOMS] User in room ${roomId} : `, roomUsers);

    return roomUsers;
}
