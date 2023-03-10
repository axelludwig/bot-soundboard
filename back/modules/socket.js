const serverManager = require('./server')
const channelManager = require('./discord/channel-manager');
const soundManager = require('./discord/sound-manager');

require('./discord/event-manager');

const io = require("socket.io")(serverManager.server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('test', (res) => {
        io.emit("restest");
    })

    socket.on('joinChannel', (data) => {
        console.log('User asked bot to join channel ' + data);
        channelManager.joinChannel(data);
    });

    socket.on('leaveChannel', (data) => {
        channelManager.leaveChannel();
    });

    socket.on('playSound', (data) => {
        soundManager.playSound(data);
    });

    socket.on('pauseSound', (data) => {
        soundManager.pauseSound();
    })

    socket.on('unpauseSound', (data) => {
        soundManager.unpauseSound();
    })

    socket.on('setVolume', (data) => {
        soundManager.setVolume(data);
        io.emit('botChangeVolume', data);
    });

    socket.on('setMode', (data) => {
        soundManager.setMode(data);
        io.emit('botChangeMode', data);
    });

    socket.on('disconnect', (socket) => {
        console.log('a user disconnected');
    });
});

exports.io = io;