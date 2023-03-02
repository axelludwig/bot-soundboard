const serverManager = require('./server')
const io = require("socket.io")(serverManager.server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('test', (socket) => {
        io.emit("restest");
    })
});

exports.io = io;