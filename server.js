const express = require('express');

const PORT = 3000;
const app = express(); 
const http = require('http');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

const sockets = [];

io.on('connection', ( socket ) => {

    sockets.push(socket);
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        console.log('Message : ', msg);
        sockets.forEach(socket => {
            socket.emit('chat message', msg)
        })
    })

    socket.on('disconnect', () => {
        console.log('A user disconected');
    })
})

// Routes
app.get('/', (req, res) => res.send({ message: 'Hello World!' }));

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));