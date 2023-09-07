import { Socket } from "socket.io";
import { AddUserType } from "../types/UserType";
import { getRoomList } from "../utils/utils";
import { io } from "../server";
import { client } from "../redis/redis";

/**
 * JOIN ROOM
 */
export const joinRoom = async (userInfo: AddUserType, socket: Socket) => {
    getRoomList();
    
    socket.join(userInfo.roomId);
    socket.data.roomId = userInfo.roomId;
    socket.data.username = userInfo.username;
    socket.data.userId = userInfo.userId;
    console.log(`\n[JOIN] User ${userInfo.username} join room : ${userInfo.roomId}`);

    const users = await getUsersInRoom(userInfo.roomId);
    
    socket.to(userInfo.roomId).emit('update-userList', users);
}


/**
 * SEND MESSAGE TO ROOM
 */
export const sendMessageToRoom = async (userInfo: AddUserType, socket: Socket) => {
    console.log(`[MESSAGE] Message send by ${socket.data.username} : `, userInfo);

    const title = `${userInfo.roomId}:conv`;
    const pos = (await client.sMembers(title)).length;
    const content = JSON.stringify({...userInfo, order: pos});
    client.sAdd(title, content)

    io.to(userInfo.roomId).emit('message', {...userInfo, order: pos});
}


/**
 * GET USER IN ROOM
 */
export const getUsersInRoom = async (roomId: string) => {
    const roomUsers = (await io.in(roomId).fetchSockets())
        .map((socket: any) => ({
                userId: socket.data.userId,
                username: socket.data.username,
            }));
    
    console.log(`\n[ROOMS] User in room ${roomId} : `, roomUsers);
    if (roomUsers.length === 0) {
        const title = `${roomId}:conv`;
        client.del(title);

        console.log(`\n[ROOMS] Room ${roomId} is closed now : `, roomUsers);
        
    }

    return roomUsers;
}


/**
 * GET CONVERSATION IN ROOM
 */
export const getConvRoom = async (roomId: string) => {
    const convRoom = (await client.sMembers(`${roomId}:conv`));
    return  convRoom;
}