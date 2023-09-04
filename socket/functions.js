const sockets = {};

// Add new user to a socket room
const addUserToGameRoom = (data, socket) => {
    console.log('join game : ', data.gameId);

    if (sockets.hasOwnProperty(data.gameId)) {
        sockets[data.gameId].usersSocket.push({id: socket.id, socket});
    } else {
        sockets[data.gameId] = {
            usersSocket: [{
                id: socket.id,
                socket
            }]
        };
    }
}

// Send a message to user
const sendMessageToGameRoom = (data) => {
    sockets[data.gameId].usersSocket.forEach(socketElt => {
        socketElt.socket.emit(data.gameId, {
            name: data.name,
            message: data.message
        })
    })
}

// Remove user from sockets list if disconnected
const logoutFromGameRoom = (socketId) => {
    for (const key in sockets) {
        sockets[key].usersSocket = sockets[key].usersSocket.filter(user => user.id !== socketId);
    }
}

module.exports = {
    addUserToGameRoom,
    sendMessageToGameRoom,
    logoutFromGameRoom
}