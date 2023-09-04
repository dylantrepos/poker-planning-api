const express = require('express');

const PORT = 3000;
const app = express(); 
const http = require('http');
const cors = require('cors');
const socketElt = require('./socket/routes');

app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' }});

io.on('connection', ( socket ) => socketElt(socket))

// Routes
app.get('/', (req, res) => res.send({ message: 'Hello World!' }));

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));