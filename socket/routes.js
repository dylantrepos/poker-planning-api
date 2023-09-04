const { addUserToGameRoom, sendMessageToGameRoom, logoutFromGameRoom } = require("./functions");


const routes = ( socket ) => {
    socket.on('join game', (data) => addUserToGameRoom(data, socket));

    socket.on('chat message', (data) => sendMessageToGameRoom(data));

    socket.on('disconnect', () => logoutFromGameRoom(socket.id))
}
module.exports = routes