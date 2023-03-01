const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const path = require('node:path');
const voiceData = require('../voice-data.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('swing')
		.setDescription('I will play some nice music ;) !'),
	async execute(interaction) {
		console.log("Current guildId is " + interaction.guildId + ", channelId is " + interaction.member.voice.channelId);

		let connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator
		});

		voiceData.connections[interaction.guildId] = connection;


		const player = createAudioPlayer();

		let audioPath = path.join(__dirname, 'sounds/audio.mp3');
		const resource = createAudioResource(audioPath, { inlineVolume: true });
		resource.volume.setVolume(0.5);

		player.play(resource);
		connection.subscribe(player);

		await interaction.reply('Ca part en musique ;)');
	},
};