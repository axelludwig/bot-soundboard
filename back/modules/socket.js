const serverManager = require('./server')
const io = require("socket.io")(serverManager.server, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('test', (socket) => {
        console.log("ok test");
        io.emit("restest");
    })
});

exports.io = io;