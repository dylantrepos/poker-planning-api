import { Socket } from "socket.io";
import { MessageList, Room, User } from '../types/UserType';
import { getRoomList } from "../utils/utils";
import { io } from "../server";
import { client } from "../redis/redis";

/**
 * JOIN ROOM
 */
export const joinRoom = async (userInfo: User, socket: Socket): Promise<void> => {
    getRoomList();

    
    socket.join(userInfo.roomId);
    
    
    socket.data.roomId = userInfo.roomId;
    socket.data.username = userInfo.username;
    socket.data.userId = userInfo.userId;
    socket.data.role = 'user';
    
    
    
    console.log(`\n[JOIN] User ${userInfo.username} join room : ${userInfo.roomId}`);
    
    let userList = await getUsersInRoom(userInfo.roomId);
    const leadExists = userList.find((user: User) => user.role === 'lead');
    socket.data.role = !leadExists || userList.length === 1 || (leadExists && leadExists.userId === userInfo.userId) ? 'lead' :'user';
    userList = await getUsersInRoom(userInfo.roomId);

    console.log('user list )))))) : ', userList);

    const emitData: Room = {
      roomId: userInfo.roomId,
      userList
    };
    
    socket.to(userInfo.roomId).emit('update-userList', emitData);
}


/**
 * SEND MESSAGE TO ROOM
 */
export const sendMessageToRoom = async (userInfo: User, socket: Socket): Promise<void> => {
    console.log(`[MESSAGE] Message send by ${socket.data.username} : `, userInfo);

    const title = `${userInfo.roomId}:messages`;
    const pos = (await client.sMembers(title)).length;
    const content = JSON.stringify({...userInfo, order: pos});
    
    client.sAdd(title, content)

    const emitData: MessageList = {
      ...userInfo, 
      order: pos
    }

    io.to(userInfo.roomId).emit('message', emitData);
}


/**
 * GET USER IN ROOM
 */
export const getUsersInRoom = async (roomId: string): Promise<User[]> => {
    const roomUsers = (await io.in(roomId).fetchSockets())
        .map((socket: any) => ({
                userId: socket.data.userId,
                roomId: socket.data.roomId,
                username: socket.data.username,
                role: socket.data.role
            }));
    
    console.log(`\n[ROOMS] User in room ${roomId} : `, roomUsers);
    
    if (roomUsers.length === 0) {
        const title = `${roomId}:messages`;
        client.del(title);

        console.log(`\n[ROOMS] Room ${roomId} is closed now : `, roomUsers);
        
    }

    return roomUsers;
}


/**
 * GET MESSAGES IN ROOM
 */
export const getMessages = async (roomId: string): Promise<string[]> => {
    const messages = (await client.sMembers(`${roomId}:messages`));
    return messages;
}