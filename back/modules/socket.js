const serverManager = require('./server')
const channelManager = require('./channel-manager');
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

    socket.on('getChannelsInfos', (data) => {
        channelManager.getChannels().then((result => {
            socket.emit('getChannelsInfosResult', result);
        }));
    });
    
});


exports.io = io;