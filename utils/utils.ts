import { getio } from '../socketConnection';

console.log('utils.ts');

export const getRoomList = () => {
    const io = getio();
    // console.log('\n[ROOMS] rooms available : ', io.sockets.adapter.rooms);
}
