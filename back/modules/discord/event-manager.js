const socket = require('../socket');
const discordConfig = require("../../discord-config.json");

exports.onUserChangeChannel = function(interaction){
    if (interaction.guild.id == discordConfig.guildId && interaction.id == discordConfig.clientId){
        //Le bot a changé de channel
        console.log('sened bot change channel : ' + interaction.channelId);
        socket.io.emit('botChangeChannel', interaction.channelId);
        return interaction.channelId;
    }

    return undefined;
}