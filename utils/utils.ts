import { Socket } from 'socket.io';
import { getio, ioElt } from '../socketConnection';
import { Message, RoomId, User, UserId, UserList, Vote } from '../types/UserType';
import { client, getLeadId } from '../redis/redis';

/**
 * Update vote for all socket containing `userId`.
 */
export const updateUserVote = (userId: UserId, vote: Vote): void => {
    ioElt.sockets.sockets.forEach((socket: Socket) => {
      if(socket.data.userId === userId) {
        socket.data.vote = vote;
      }
    })
}

/**
 * Send list of messages from `roomId`.
 */
export const getMessages = async (roomId: RoomId): Promise<Message[]> => {
  const messages = (await client.sMembers(`${roomId}:messages`));
  const messagesJSON = messages
    .map(message => JSON.parse(message))
    .sort((a, b) => a.order > b.order ? 1 : -1);;

  return messagesJSON;
}

/**
 * GET USER IN ROOM
 */
export const getUsersInRoom = async (roomId: RoomId): Promise<UserList> => {
  const io = getio();

  const roomUsers = (await io.in(roomId).fetchSockets())
      .map((socket) => ({
              userId: socket.data.userId,
              roomId: socket.data.roomId,
              username: socket.data.username,
              vote: socket.data.vote,
              connected: socket.data.connected,
          }));

  const newUserList: UserList = {};
  const leadCurr = await getLeadId(roomId);

  (roomUsers as User[]).map((user) => {
      const exists = newUserList.hasOwnProperty(user.userId);

      if (!exists) {
        newUserList[user.userId] = {
          userId: user.userId,
          roomId: user.roomId,
          username: user.username,
          vote: user.vote,
          connected: user.connected,
      }
      } else {
          if (user.userId === leadCurr) {
            newUserList[user.userId] = {
              userId: user.userId,
              roomId: user.roomId,
              username: user.username,
              vote: user.vote,
              connected: user.connected,
          }
        }
      }
  })

  return newUserList;
}
