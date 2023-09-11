import { Express, Request, Response } from "express";

import { getSocket, getio } from '../socketConnection';
import { client } from "../redis/redis";
import { getUsersInRoom } from "../socket/connexion";

import type { User, Vote } from "../types/UserType";


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

    const userAlreadyExists = userList.find((user: User) => 
      user.userId === req.params.userId
    );

    res.send(JSON.stringify(userAlreadyExists) ?? {userId: ''});
  });
  

  /**
   * Get all user in room
   */
  app.get('/user-list/:roomId', async (req: Request, res: Response) => {
    const userList = await getUsersInRoom(req.params.roomId);

    res.send({list: userList});
  });
  
  
  app.get('/messages/:roomId', async (req: Request, res: Response) => {
    const messages = await client.sMembers(`${req.params.roomId}:messages`);
    const messagesJSON = messages
      .map(message => JSON.parse(message))
      .sort((a, b) => a.order > b.order ? 1 : -1);
    res.send(messagesJSON ?? []);
  });
  
  
  app.get('/votes/:roomId', async (req: Request, res: Response) => {
    let userList = await getUsersInRoom(req.params.roomId);
    const userListMapped: Record<string, Vote> = {};

    userList.forEach((user: User) => {
      userListMapped[user.userId] = user.vote;
    })

    res.send(userListMapped);
  });
  
  app.get('/lead/:roomId', async (req: Request, res: Response) => {
    const roomId = await getSocket().data.roomId;
    const lead = await client.get(`${roomId}:lead`);
    
    res.send({leadId: lead});
  });
}