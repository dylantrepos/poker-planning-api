import { Express, Request, Response } from "express";

import { getio } from '../socketConnection';
import { client, getMessages, getUserList, getVoteState, getVotes } from "../redis/redis";

import type { User } from "../types/UserType";


export const routerApp = (app: Express) => {

  const io = getio();

  app.get('/', (req: Request, res: Response) => res.send({ 
    message: 'Hello World!'
  }));  


  /**
   * Check if room exists.
   */
  app.get('/check-room/:roomId', (req: Request, res: Response) => {
    res.send({exist: io.sockets.adapter.rooms.has(req.params.roomId)});
  });


  /**
   * Check if user exists in room.
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
   * Get all user from current room.
   */
  app.get('/user-list/:roomId', async (req: Request, res: Response) => {
    const userList = await getUserList(req.params.roomId);

    res.send({list: userList});
  });
  
  
  /**
   * Get all message from current room.
   */
  app.get('/messages/:roomId', async (req: Request, res: Response) => {
    const messages = await getMessages(req.params.roomId);

    res.send(messages);
  });
  
  
  /**
   * Get all votes from current room.
   */
  app.get('/votes/:roomId', async (req: Request, res: Response) => {
    const votes = await getVotes(req.params.roomId);

    res.send(votes);
  });
  

  /**
   * Get lead id from current room.
   */
  app.get('/lead/:roomId', async (req: Request, res: Response) => {
    const lead = await client.get(`${req.params.roomId}:lead`);
    
    res.send({leadId: lead});
  });
  
  
  /**
   * Get vote state for current room.
   */
  app.get('/vote-state/:roomId', async (req: Request, res: Response) => {
    const state = await getVoteState(req.params.roomId);

    res.send({close: state});
  });
}