const socket = require('../socket');
const discordConfig = require("../../discord-config.json");
const discordClient = require('./discord-client');
const channelManager = require('./channel-manager');
const { Events } = require("discord.js");

discordClient.client.on(Events.VoiceStateUpdate, async voiceState => {
    onUserChangeChannel(voiceState);
});

function onUserChangeChannel(voiceState) {
    if (voiceState.guild.id == discordConfig.guildId && voiceState.id == discordConfig.clientId) {
        //Le bot a changé de channel
        channelManager.exportCurrentChannel().then((value) => {
            if (!value){
                return;
            }

            console.log('send bot change channel : ' + value.id);
            socket.io.emit('botChangeChannel', value.id);
        });
    }
}