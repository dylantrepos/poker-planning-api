import { io } from "../server";

export const getRoomList = () => {
    console.log('\n[ROOMS] rooms available : ', io.sockets.adapter.rooms);
}
