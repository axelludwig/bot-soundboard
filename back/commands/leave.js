const { SlashCommandBuilder } = require('discord.js');
const soundManager = require('../sound-manager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Oh ok ... I will leave the channel ...'),
	async execute(interaction) {
		soundManager.leaveChannel(interaction.guild);

		interaction.reply("Très bien, je m'en vais :)");
	},
};