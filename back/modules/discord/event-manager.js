const socket = require('../socket');
const discordConfig = require("../../discord-config.json");
const discordClient = require('./discord-client');
const channelManager = require('./channel-manager');
const userManager = require('./user-manager');
const { Events } = require("discord.js");

discordClient.client.on(Events.VoiceStateUpdate, async voiceState => {
    await onUserChangeChannel(voiceState);
});

async function onUserChangeChannel(voiceState) {
    if (voiceState.guild.id == discordConfig.guildId) {
        let channel = await channelManager.getUserChannel(voiceState.id);
        if (!channel){
            //No channel found, this means that user disconnected
            socket.io.emit('userDisconnect', voiceState.id);
            if (voiceState.id == discordConfig.clientId) {
                socket.io.emit('botDisconnect', undefined);
            }
            return;
        }

        if (voiceState.channelId === channel.id){
            //Pas de changement de channel
            return;
        }

        
        let userChannelInfos = {};
        userChannelInfos.userId = voiceState.id;
        userChannelInfos.channelId = channel.id;
        let userInfos = await userManager.getUserById(voiceState.id);
        
        userChannelInfos.name = userInfos.user.username;

        console.log('send user changed channel : ' + userChannelInfos.userId);
        socket.io.emit('userChangeChannel', userChannelInfos);

        if (voiceState.id == discordConfig.clientId) {
            console.log('send bot change channel : ' + channel.name);
            socket.io.emit('botChangeChannel', channel.id);
        }
    }
}