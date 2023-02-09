const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const http = require('http');
const { connect } = require('http2');
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
    console.log('Connected')
    socket.on('message', (data) => {
        console.log('sent')
        io.emit('message', data);
    })
});





app.get('/', function (request, response) {
    console.log('loading');
    response.send({ 'Hello World': 'ME' })
})
app.get('/users', function (request, response) {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    response.send({ 'users': users })
})
app.post('/initiate', urlencodedParser, function (request, response) {
    var receipientSocketId = request.query.receipientSocketId;
    console.log(request.query.senderName);
    io.to(receipientSocketId).emit('request', {
        'senderDeviceId': request.query.senderDeviceId,
        'receipientSocketId': request.query.receipientSocketId,
        'messageId': request.query.messageId,
        'senderName': request.query.senderName === "" ? null : request.query.senderName,
        'senderSocketId': request.query.senderSocketId,
    })
    response.send(request.body);
})

app.post('/accept', urlencodedParser, function (request, response) {
    console.log('git');
    var receipientSocketId = request.query.receipientSocketId;
    console.log(receipientSocketId);
    io.to(receipientSocketId).emit('accept', {
        'senderDeviceId': request.query.senderDeviceId,
        'receipientSocketId': request.query.receipientSocketId,
        'messageId': request.query.messageId,
        'senderName': request.query.senderName === "" ? null : request.query.senderName,
        'senderSocketId': request.query.senderSocketId,
    })
    response.send(request.body);
})

server.listen(3000, () => {
    console.log('SERVER: LISTENING');
});