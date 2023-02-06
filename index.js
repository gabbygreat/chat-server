const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// const messages = []


// io.on('connection', (socket) => {
//   const username = socket.handshake.query.username
//   socket.on('message', (data) => {
//     const message = {
//       message: data.message,
//       senderUsername: username,
//       sentAt: Date.now()
//     }
//     messages.push(message)
//     io.emit('message', message)

//   })
// });

io.on('connection', (socket) => {
    console.log('A user connected');
    console.log(socket);
    socket.on('message', (data) => {
        console.log(data);
        io.emit('message', 'Test')
    })
});


app.get('/', function (request, response) {
    console.log('loading');
    response.send({ 'Hello World': 'ME' })
})
server.listen(3000, () => {
    console.log('SERVER: LISTENING');
});