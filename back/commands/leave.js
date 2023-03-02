const { SlashCommandBuilder } = require('discord.js');
const channelManager = require('../modules/discord/channel-manager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Oh ok ... I will leave the channel ...'),
    async execute(interaction) {
        channelManager.leaveChannel();

        interaction.reply("Très bien, je m'en vais :)");
    },
};