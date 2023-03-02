const { SlashCommandBuilder } = require('discord.js');
const soundManager = require('../modules/sound-manager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('swing')
        .setDescription('I will play some nice music ;) !'),
    async execute(interaction) {
        console.log("Current guildId is " + interaction.guildId + ", channelId is " + interaction.member.voice.channelId);
        if (!interaction.member.voice.channelId) {
            await interaction.reply('User is not in a channel');
            return;
        }

        soundManager.playSound(interaction.guild, interaction.member.voice.channelId, 'audio');

        await interaction.reply('Ca part en musique ;)');
    },
};