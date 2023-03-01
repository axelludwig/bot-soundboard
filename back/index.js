const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { send } = require('process');
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected\n');
    });

    socket.on('test', (socket) => {
        console.log("ok test");
        io.emit("restest");
    })
});




server.listen(3000, () => {
    console.log('listening on *:3000');
});