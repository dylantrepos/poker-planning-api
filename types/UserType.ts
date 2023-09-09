export type User = {
    roomId: string;
    userId?: string;
    username: string;
    role: 'user' | 'lead';
    vote?: string;
}

export type Room = {
  roomId: string;
  userList: User[];
}

export type MessageList = User & { order: number }