import { Socket as SocketType } from "socket.io";
import { Connected, Lead, Role, RoomId, User, UserId, UserMessage, UserVote, UserVoteOpenClose, Username, Vote } from "./UserType";

export interface SocketData {
  roomId: RoomId;
  username: Username;
  userId: UserId;
  vote: Vote;
  connected: Connected;
  role: Role;
}

export interface ServerToClientEvents {
  'lead:update': (userId: string) => void;
  'userList:update': (userList: User[]) => void;
  'message:received': (userData: UserMessage) => void;
  'vote:received': (userData: UserVote) => void;
  'vote:close': (state: Boolean) => void;
  'vote:open': (state: Boolean) => void;
}

export interface ClientToServerEvents {
  'room:join': (userInfo: User) => void;
  'message:create': (userMessage: UserMessage) => void;
  'vote:create': (vote: UserVote) => void;
  'vote:close': (voteInfo: UserVoteOpenClose) => void;
  'vote:open': (voteInfo: UserVoteOpenClose) => void;
  'lead:update': (leadInfo: Lead) => void;
}

export interface InterServerEvents {
}

export type Socket = SocketType<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>