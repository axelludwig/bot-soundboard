const serverManager = require('./server')
const channelManager = require('./discord/channel-manager');
const soundManager = require('./discord/sound-manager');
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
        channelManager.exportChannels().then((result => {
            socket.emit('getChannelsInfosResult', result);
        }));
    });

    socket.on('joinChannel', (data) => {
        channelManager.joinChannel(data);
    });
    
    socket.on('leaveChannel', (data) => {
        channelManager.leaveChannel();
    });

    socket.on('playSound', (data) => {
        soundManager.playSound(data);
    });
});


exports.io = io;