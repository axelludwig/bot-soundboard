const serverManager = require('./server')
const channelManager = require('./discord/channel-manager');
const soundManager = require('./discord/sound-manager');
const discordClient = require('./discord/discord-client');

const eventManager = require('./discord/event-manager');

const { Events} = require("discord.js");

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
        console.log(data);
        channelManager.joinChannel(data);
    });

    socket.on('leaveChannel', (data) => {
        channelManager.leaveChannel();
    });

    socket.on('playSound', (data) => {
        soundManager.playSound(data);
    })

    socket.on('disconnect', (socket) => {
        console.log('a user disconnected');
    });
});

discordClient.client.on(Events.VoiceStateUpdate, async interaction => {
    eventManager.onUserChangeChannel(interaction);
});

exports.io = io;