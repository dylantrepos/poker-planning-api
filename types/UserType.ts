export type RoomId = string;
export type UserId = string;
export type Username = string;
export type Role = 'user' | 'lead';
export type Message = string;
export type Connected = boolean;
export type Vote = 
  '' | '0' | '1/2' | '1' | '2' | 
  '3' | '5' | '8' | '13' | 
  '20' | '40' | '100' | '?' | 
  'infinity' | 'cafe';

export type User = {
    roomId: RoomId;
    userId: string;
    username: Username;
    role: Role;
    vote: Vote;
}

export type Lead = {
  roomId: RoomId;
  leadId: UserId;
}

export type Room = {
  roomId: RoomId;
  userList: User[];
}

/**
 * Vote
 */

export type UserVote = {
  userId: UserId,
  roomId: RoomId,
  vote: Vote
}

export type UserVoteOpenClose = {
  roomId: RoomId;
  userId: UserId;
}

/**
 * Message
 **/
export type UserMessage = {
  roomId: RoomId;
  userId: UserId;
  username: Username;
  message: Message;
}

export type MessageList = UserMessage & { order: number }

