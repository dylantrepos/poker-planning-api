import { addMessage, addUserToList, getLeadId, getUserList, getVotes, setLeadId, setVote, setVoteState } from '../redis/redis';
import { ioElt as io, ioElt } from '../socketConnection';

import type { Socket } from "../types/SocketType";
import type { Lead, RoomId, User, UserMessage, UserVote, UserVoteOpenClose } from '../types/UserType';

/**
 * JOIN ROOM
*/
export const joinRoom = async (socket: Socket, userInfo: User): Promise<void> => {
  const { roomId, userId, userName } = userInfo;
  
  socket.join(roomId);

  const leadCurr = await getLeadId(roomId) ?? userId;
  const isLead = leadCurr === userId;
  
  socket.data.roomId = roomId;
  socket.data.userName = userName;
  socket.data.userId = userId;
  socket.data.connected = true;

  if (isLead) {
    setLeadId(roomId, userId);
    setVoteState(roomId, false);
  }

  addUserToList(roomId, userInfo);
}

/**
 * SEND MESSAGE TO ROOM
 */
export const sendMessageToRoom = async (userMessage: UserMessage): Promise<void> => { 
  const { roomId } = userMessage
  await addMessage(roomId, userMessage);

  io.to(userMessage.roomId).emit('message:received', userMessage);
}


/**
 * SEND VOTE TO ROOM
 */
export const sendVoteToRoom = async (userInfo: UserVote): Promise<void> => { 
  const { userId, roomId, vote } = userInfo

  await setVote(roomId, userId, vote);

  const votes = await getVotes(roomId);

  io.to(roomId).emit('vote:received', votes);
}

/**
 * CLOSE VOTE FOR ROOM
 */
export const closeVoteToRoom = async (roomId: RoomId): Promise<void> => { 
  setVoteState(roomId, true);

  io.to(roomId).emit('vote:close');
}
  
/**
 * OPEN VOTE FOR ROOM
 */
 export const openVoteToRoom = async (roomId: RoomId): Promise<void> => { 
  (await io.in(roomId).fetchSockets()).forEach((socket) => socket.data.vote = '');

  await setVoteState(roomId, false);

  io.to(roomId).emit('vote:open');
}


/**
 * UPDATE NEW LEAD
 */
export const sendNewLead = async (data: Lead): Promise<void> => {
  const { roomId, leadId } = data;

  setLeadId(roomId, leadId);
}
