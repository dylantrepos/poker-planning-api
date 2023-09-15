import { Server, Socket as SocketType } from "socket.io";
import { Connected, Lead, Role, RoomId, User, UserId, UserList, UserMessage, UserVote, UserVoteOpenClose, Username, Vote, VoteList } from "./UserType";

export interface SocketData {
  roomId: RoomId;
  userName: Username;
  userId: UserId;
  vote: Vote;
  connected: Connected;
}

export interface ServerToClientEvents {
  'lead:update': (userId: string) => void;
  'userList:update': (userList: UserList) => void;
  'message:received': (userData: UserMessage) => void;
  'vote:received': (voteList: VoteList) => void;
  'vote:close': () => void;
  'vote:open': () => void;
}

export interface ClientToServerEvents {
  'room:join': (userInfo: User) => void;
  'message:create': (userMessage: UserMessage) => void;
  'vote:create': (vote: UserVote) => void;
  'vote:close': (roomId: RoomId) => void;
  'vote:open': (roomId: RoomId) => void;
  'lead:update': (leadInfo: Lead) => void;
}

export interface InterServerEvents {
}

export type Socket = SocketType<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type ServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;