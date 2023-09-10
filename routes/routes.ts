import { Request, Response } from "express";
import { getSocket, getio } from '../socketConnection';
import { Express } from 'express';
import { getMessages } from "../socket/connexion";
import { client } from "../redis/redis";
import { User } from "../types/UserType";


export const routerApp = (app: Express) => {

  const io = getio();

  app.get('/', (req: Request, res: Response) => res.send({ 
    message: 'Hello World!'
  }));  

  /**
   * Check if room exists
   */
  app.get('/check-room/:roomId', (req: Request, res: Response) => {
    // console.log('[ROOMS] Rooms availables : ', io.sockets.adapter.rooms);
    res.send({exist: io.sockets.adapter.rooms.has(req.params.roomId)});
  });

  /**
   * Check if user exists
   */
  app.get('/check-user/:roomId/:userId', async (req: Request, res: Response) => {
    let userListRedis = await client.sMembers(`${req.params.roomId}:userList`);
    let userList: User[] = userListRedis.map(user => JSON.parse(user));

    console.log('id received: ', req.params);
    console.log('user list : ', userListRedis);
    console.log('user list : ', userList);
    
    const userAlreadyExists = userList.find((user: User) => user.userId === req.params.userId);

    res.send(JSON.stringify(userAlreadyExists) ?? {userId: ''});
  });
  

  /**
   * Get all user in room
   */
  app.get('/user-list/:roomId', async (req: Request, res: Response) => {
    const roomId = getSocket().data.roomId;

    let userListRedis = await client.sMembers(`${roomId}:userList`);
    let userList: User[] = userListRedis.map(user => JSON.parse(user));

    res.send(userList);
  });
  
  
  app.get('/messages/:roomId', async (req: Request, res: Response) => {
    const roomId = await getSocket().data.roomId;
    const messages = await client.sMembers(`${roomId}:messages`);
    const messagesJSON = messages
      .map(message => JSON.parse(message))
      .sort((a, b) => a.order > b.order ? 1 : -1);

    res.send(messagesJSON);
  });
  
  
  app.get('/votes/:roomId', async (req: Request, res: Response) => {
    const roomId = await getSocket().data.roomId;
    const votes = await client.sMembers(`${roomId}:vote`);
    const votesJSON = votes
      .map(vote => JSON.parse(vote))

    res.send(votesJSON);
  });
}