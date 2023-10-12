import { createClient } from 'redis';
import { MessageList, RoomId, UserId, Vote, VoteState, UserMessage, User, UserList } from '../types/UserType';
import { ioElt } from '../socketConnection';
import "dotenv/config.js";

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: process.env.REDISCLOUD_HOST,
      port: +(process.env.REDIS_PORT || 0)
  }
});

client.connect();

client.on('error', err => console.log('Redis err : ', err));
client.on('connect', async () => {
  await client.flushAll();
});


/**
 * Users
 */
export const getUserList = async (roomId: RoomId): Promise<UserList> => {
  const userList = await client.get(`${roomId}:userList`);
  const userListJson = JSON.parse(userList ?? '{}');
  
  return userListJson;
}

export const addUserToList = async (roomId: RoomId, user: User): Promise<void> => {
  const currentUserList = await getUserList(roomId);

  console.log('roomid : ', roomId);
  console.log('curr : ', currentUserList);
  
  currentUserList[user.userId] = {
    userId: user.userId,
    roomId: user.roomId,
    userName: user.userName,
    connected: true,
  };

  

  await client.set(`${roomId}:userList`, JSON.stringify(currentUserList));
  ioElt.to(roomId).emit('userList:update', currentUserList);
}

export const removeUserFromList = async (roomId: RoomId, userId: UserId): Promise<void> => {
  const userListSockets = await ioElt.in(roomId).fetchSockets();
  const currentUserList = await getUserList(roomId);
  const currentLead = await getLeadId(roomId);
  const isNotLive = !userListSockets.find((user) => user.data.userId === userId);

  if (isNotLive) {
    if (currentLead === userId) {
      const newLeadId = userListSockets[0].data.userId;
      setLeadId(roomId, newLeadId);
    }

    currentUserList[userId].connected = false;
    
    await client.set(`${roomId}:userList`, JSON.stringify(currentUserList));

    ioElt.to(roomId).emit('userList:update', currentUserList);
  }
}


/**
 * Messages
 */
export const getMessages = async (roomId: RoomId): Promise<MessageList[]> => {
  const messages = await client.sMembers(`${roomId}:messages`);
  const messagesJson = messages
    .map(message => JSON.parse(message))
    .sort((a, b) => a.order > b.order ? 1 : -1);
  
  return messagesJson ?? [];
}

export const addMessage = async (roomId: RoomId, userMessage: UserMessage): Promise<void> => {
  let currentMessages = await getMessages(roomId);
  const pos = currentMessages.length;

  await client.sAdd(`${roomId}:messages`, JSON.stringify({...userMessage, order: pos}))
}


/**
 * Votes Users
 */
export const getVotes = async (roomId: RoomId): Promise<Record<UserId, Vote>> => {
  const votes = await client.get(`${roomId}:votes`);
  const votesJson = JSON.parse(votes ?? '{}');

  return votesJson;
}

export const setVote = async (roomId: RoomId, userId: UserId, vote: Vote): Promise<void> => {
  let currentVotes = await getVotes(roomId);
  currentVotes[userId] = vote;

  await client.set(`${roomId}:votes`, JSON.stringify(currentVotes));
}


/**
 * Vote State  
 */
export const getVoteState = async (roomId: RoomId): Promise<VoteState> => {
  const state = await client.get(`${roomId}:voteState`) === 'true';

  return state;
}

export const setVoteState = async (roomId: RoomId, state: VoteState): Promise<void> => {
  if (!state) client.del(`${roomId}:votes`);
  await client.set(`${roomId}:voteState`, state.toString());
}


/**
 * Lead
 */
export const getLeadId = async (roomId: RoomId): Promise<UserId | null> => {
  const state = await client.get(`${roomId}:lead`);
  return state;
}

export const setLeadId = async (roomId: RoomId, userId: UserId): Promise<void> => {
  await client.set(`${roomId}:lead`, userId);

  ioElt.to(roomId).emit('lead:update', userId);
}