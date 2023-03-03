const socket = require('../socket');
const discordConfig = require("../../discord-config.json");
const discordClient = require('./discord-client');
const { Events} = require("discord.js");

discordClient.client.on(Events.VoiceStateUpdate, async interaction => {
    onUserChangeChannel(interaction);
});

function onUserChangeChannel(interaction){
    if (interaction.guild.id == discordConfig.guildId && interaction.id == discordConfig.clientId){
        //Le bot a changé de channel
        console.log('send bot change channel : ' + interaction.channelId);
        socket.io.emit('botChangeChannel', interaction.channelId);
        return interaction.channelId;
    }

    return undefined;
}