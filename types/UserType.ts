export type User = {
    roomId: string;
    userId?: string;
    username: string;
}

export type Room = {
  roomId: string;
  userList: User[];
}

export type MessageList = User & { order: number }