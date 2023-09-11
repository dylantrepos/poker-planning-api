import { client } from "../redis/redis";
import { getAllSockets, getio, ioElt as io, ioElt } from '../socketConnection';

import type { Socket } from "../types/SocketType";
import type { Lead, MessageList, RoomId, User, UserMessage, UserVote, UserVoteOpenClose } from '../types/UserType';

/**
 * JOIN ROOM
*/
export const joinRoom = async (socket: Socket, userInfo: User): Promise<void> => {
  
  socket.join(userInfo.roomId);
  
  socket.data.roomId = userInfo.roomId;
  socket.data.username = userInfo.username;
  socket.data.userId = userInfo.userId;
  socket.data.vote = userInfo.vote;
  socket.data.connected = true;

  let userList = await getUsersInRoom(userInfo.roomId);

  const createTheRoom = userList.length === 1;
  const isLead = (userList.find((user: User) => user.userId === userInfo.userId)?.role ?? 'user') === 'lead';

  socket.data.role = createTheRoom || isLead ? 'lead' : 'user';

  if (createTheRoom) {
    await client.set(`${userInfo.roomId}:lead`, userInfo.userId)
    const lead = await client.get(`${userInfo.roomId}:lead`);
    
    io.to(userInfo.roomId).emit('lead:update', userInfo.userId);
  }

  userList = await getUsersInRoom(userInfo.roomId);

  io.to(userInfo.roomId).emit('userList:update', userList);
}

/**
 * SEND MESSAGE TO ROOM
 */
export const sendMessageToRoom = async (userInfo: UserMessage): Promise<void> => { 
    const title = `${userInfo.roomId}:messages`;
    const pos = (await client.sMembers(title)).length;
    const content = JSON.stringify({...userInfo, order: pos});
    
    client.sAdd(title, content)

    io.to(userInfo.roomId).emit('message:received', userInfo);
}


/**
 * SEND VOTE TO ROOM
 */
export const sendVoteToRoom = async (userInfo: UserVote): Promise<void> => { 
    // Update vote to users having userInfo.userId
    getAllSockets()
      .forEach((socket: Socket) => {
        if(socket.data.userId === userInfo.userId) {
          socket.data.vote = userInfo.vote;
        }
      })

    io.to(userInfo.roomId).emit('vote:received', userInfo);
}

/**
 * CLOSE VOTE FOR ROOM
 */
export const closeVoteToRoom = async (voteData: UserVoteOpenClose): Promise<void> => { 
    io.to(voteData.roomId).emit('vote:close', true);
}

/**
 * OPEN VOTE FOR ROOM
 */
export const openVoteToRoom = async (voteData: UserVoteOpenClose): Promise<void> => { 
    (await io.in(voteData.roomId).fetchSockets()).forEach((socket) => socket.data.vote = '');

    io.to(voteData.roomId).emit('vote:open', false);
}




/**
 * GET USER IN ROOM
 */
export const getUsersInRoom = async (roomId: RoomId): Promise<User[]> => {
    const io = getio();

    const roomUsers = (await io.in(roomId).fetchSockets())
        .map((socket) => ({
                userId: socket.data.userId,
                roomId: socket.data.roomId,
                username: socket.data.username,
                role: socket.data.role,
                vote: socket.data.vote,
            }));

    const newUserList: User[] = [];

    (roomUsers as User[]).map((user) => {
        const exists = newUserList.findIndex(u => u.userId === user.userId);
        if (exists === -1) {
          newUserList.push(user);
        } else {
          if (user.role === 'lead') {
            newUserList.splice(exists, 1, user)
          }
        }
    })
    
    console.log(`\n[ROOMS] User in room ${roomId} : `, roomUsers);

    return newUserList;
}


/**
 * GET MESSAGES IN ROOM
 */
export const getMessages = async (roomId: RoomId): Promise<MessageList[]> => {
    const messages = (await client.sMembers(`${roomId}:messages`));
    const messagesJSON = messages
      .map(message => JSON.parse(message))
      .sort((a, b) => a.order > b.order ? 1 : -1);;

    return messagesJSON;
}

/**
 * UPDATE NEW LEAD
 */
export const sendNewLead = async (data: Lead): Promise<void> => {
  
  await client.set(`${data.roomId}:lead`, data.leadId)

  ioElt.to(data.roomId).emit('lead:update', data.leadId);
}
