import { Socket } from "socket.io";
import { MessageList, Room, User } from '../types/UserType';
import { client } from "../redis/redis";
import { getSocket, getio } from '../socketConnection';

export const createRoom = async (userInfo: User) => {
  console.log('Created room : ', userInfo);
  const socket = getSocket();

  socket.join(userInfo.roomId);
  socket.data.roomId = userInfo.roomId;
  socket.data.username = userInfo.username;
  socket.data.userId = userInfo.userId;
  socket.data.role = 'user';
  socket.data.vote = userInfo.vote;
  socket.data.connected = true;

  await client.sAdd(`${userInfo.roomId}:userList`, JSON.stringify(userInfo));
  await client.set(`${userInfo.roomId}:lead`, userInfo.userId);
}

/**
 * JOIN ROOM
*/
export const joinRoom = async (userInfo: User): Promise<void> => {
  const socket = getSocket();
  const io = getio();

  console.log('Join room : ', userInfo);
  
  socket.join(userInfo.roomId);
  socket.data.roomId = userInfo.roomId;
  socket.data.username = userInfo.username;
  socket.data.userId = userInfo.userId;
  socket.data.role = 'user';
  socket.data.vote = userInfo.vote;
  socket.data.connected = true;

  let userListRedis = await client.sMembers(`${userInfo.roomId}:userList`);
  let userList: User[] = userListRedis.map(user => JSON.parse(user));
  
  const userAlreadyExists: any = userList.find((user: User) => user.userId === userInfo.userId);
  
  if (!userAlreadyExists) {
    await client.sAdd(`${userInfo.roomId}:userList`, JSON.stringify(userInfo));  
    userList.push(userInfo);
  } else {
    if (userAlreadyExists.connected === false) {
      userList.forEach((user: any) => {
        if (user.userId === userInfo.userId) user.connected = true;
      })

      await client.del(`${socket.data.roomId}:userList`);

      for (const user of userList) {
        await client.sAdd(`${socket.data.roomId}:userList`, JSON.stringify(user));
      }
    }
  }

  io.to(userInfo.roomId).emit('userList:update', userList);
}

const defineLead = async () => {
  const {roomId, userId} = getSocket().data;
  console.log('userId : ', userId);
  console.log('roomId : ', roomId);
  const currentLead = await client.get(`${roomId}:lead`);
  console.log('currentLead : ', currentLead);
  
  if (!currentLead) {
    
    await client.set(`${roomId}:lead`, userId);
    const currentLead = await client.get(`${roomId}:lead`);
    console.log('currentLead update : ', currentLead);
  }
}


/**
 * SEND MESSAGE TO ROOM
 */
export const sendMessageToRoom = async (userInfo: User): Promise<void> => { 
    const io = getio();

    const title = `${userInfo.roomId}:messages`;
    const pos = (await client.sMembers(title)).length;
    const content = JSON.stringify({...userInfo, order: pos});
    
    client.sAdd(title, content)

    io.to(userInfo.roomId).emit('message:received', userInfo);
}


/**
 * SEND MESSAGE TO ROOM
 */
export const sendVoteToRoom = async (userInfo: User): Promise<void> => { 
    const io = getio();

    const title = `${userInfo.roomId}:vote`;

    console.log('vote : ', title, userInfo);
    let voteListRedis = await client.sMembers(title);
    if (voteListRedis) {
      console.log('vote : ', voteListRedis);
      let voteList: any[] = voteListRedis.map(vote => JSON.parse(vote));
      const checkVoteExists = voteList.find((vote: any) => vote.userId === userInfo.userId)
      
      if (checkVoteExists) {
        voteList.forEach((vote: any) => {
          if (vote.userId === userInfo.userId) vote.vote = userInfo.vote
        })
      } else {
        voteList.push(userInfo)
      }

      client.del(title)
      voteList.forEach((vote: any) => {
        client.sAdd(title, JSON.stringify(vote))
      })

      io.to(userInfo.roomId).emit('vote:received', voteList);
    }
    

}


/**
 * GET USER IN ROOM
 */
export const getUsersInRoom = async (roomId: string): Promise<User[]> => {
    const io = getio();

    const roomUsers = (await io.in(roomId).fetchSockets())
        .map((socket: any) => ({
                userId: socket.data.userId,
                roomId: socket.data.roomId,
                username: socket.data.username,
                role: socket.data.role,
                vote: socket.data.vote ?? '',
            }));
    
    // console.log(`\n[ROOMS] User in room ${roomId} : `, roomUsers);
    
    if (roomUsers.length === 0) {
        const title = `${roomId}:messages`;
        client.del(title);

        // console.log(`\n[ROOMS] Room ${roomId} is closed now : `, roomUsers);
        
    }

    return roomUsers;
}


/**
 * GET MESSAGES IN ROOM
 */
export const getMessages = async (roomId: string): Promise<string[]> => {
    const messages = (await client.sMembers(`${roomId}:messages`));
    const messagesJSON = messages
      .map(message => JSON.parse(message))
      .sort((a, b) => a.order > b.order ? 1 : -1);;

    return messagesJSON;
}

export const updateVote = async (vote: string) => {
  // const io = getio();
  // const socket = getSocket();

  // const allSockets = await io.in(socket.data.roomId).fetchSockets();
  // allSockets.forEach((socketEl: Socket) => {
  //   if (socketEl.data.userId === socket.data.userId) {
  //     socketEl.data.vote = vote;
  //   }
  // })
  // // console.log(`[VOTE] New vote received from : ${socket.data.username}. Vote : ${vote}`);
  // // console.log(`[VOTE] New socket : `, allSockets.map((socket: Socket) => socket.data));

  // const userListData = await getUsersInRoom(socket.data.roomId);
  // const userList: User[] = [...new Map((userListData)
  //   .map((v: User) => [v.userId, v]))
  //   .values()];
    
  // // const newUserList: any[] = [];
    
  // // console.log('emit data : ', userListData);

  // // userListData.map((user: any) => {
  // //     const exists = newUserList.findIndex(u => u.userId === user.userId);
  // //     if (exists === -1) {
  // //       newUserList.push(user);
  // //     } else {
  // //       if (user.role === 'lead') {
  // //         newUserList.splice(exists, 1)
  // //       }
  // //     }
  // // })

  // const emitData: Room = {
  //   roomId: socket.data.roomId,
  //   userList: userList
  // };
  // // console.log('emit data : ', emitData);
  // io.to(socket.data.roomId).emit('vote', emitData);
}