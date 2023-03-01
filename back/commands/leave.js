const { SlashCommandBuilder } = require('discord.js');
const voiceData = require('../voice-data.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Oh ok ... I will leave the channel ...'),
	async execute(interaction) {
		let connection = voiceData.connections[interaction.guildId];
		if (connection) {
			connection.destroy();
			voiceData.connections[interaction.guildId] = undefined;
		}
	},
};