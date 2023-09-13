import { createClient } from 'redis';
import { Message, MessageList, RoomId, UserId, Vote, VoteState, UserMessage } from '../types/UserType';

export const client = createClient();

client.connect();

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', async () => {
  await client.flushAll();
  console.log('Redis DB has been started successfully.');
  console.log('Redis DB has been reset successfully.');
});


/**
 * Votes Users
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
}