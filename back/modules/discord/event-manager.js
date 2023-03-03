const socket = require('../socket');
const discordConfig = require("../../discord-config.json");
const discordClient = require('./discord-client');
const channelManager = require('./channel-manager');
const { Events } = require("discord.js");

discordClient.client.on(Events.VoiceStateUpdate, async voiceState => {
    onUserChangeChannel(voiceState);
});

function onUserChangeChannel(voiceState) {
    if (voiceState.guild.id == discordConfig.guildId) {
        channelManager.getUserChannel(voiceState.id).then((channel) => {
            let userChannelInfos = {};
            userChannelInfos.userId = voiceState.id;
            userChannelInfos.channelId = channel.id;

            console.log('send user changed channel : ' + userChannelInfos.userId);
            socket.io.emit('userChangeChannel', userChannelInfos);
        });

        if (voiceState.id == discordConfig.clientId) {
            //Le bot a changé de channel
            channelManager.exportCurrentChannel().then((value) => {
                if (!value) {
                    return;
                }

                console.log('send bot change channel : ' + value.id);
                socket.io.emit('botChangeChannel', value.id);
            });
        }
    }
}