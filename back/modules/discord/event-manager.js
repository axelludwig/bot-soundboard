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
            //Le bot a changé de channel
            let botCurrentChannel = channelManager.exportCurrentChannel();
            if (!botCurrentChannel) {
                return;
            }

            console.log('send bot change channel : ' + botCurrentChannel.id);
            socket.io.emit('botChangeChannel', botCurrentChannel.id);
        }
    }
}