const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, getVoiceConnection   } = require('@discordjs/voice');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('swing')
		.setDescription('I will play some nice music ;) !'),
	async execute(interaction) {
		let currentConnection = getVoiceConnection(interaction.guild.id)
		console.log("Current connection : " + currentConnection);
		let connection = undefined;
		if (currentConnection){
			connection = currentConnection;
		}
		else{
			connection = joinVoiceChannel({
				channelId: interaction.member.voice.channelId,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});
		}

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		let audioPath = path.join(__dirname, 'sounds/audio.mp3');
		console.log(audioPath)
		const resource = createAudioResource(audioPath);
		player.play(resource);

		await connection.subscribe(player);
	},
};