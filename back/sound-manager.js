const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    //Members
    storedConnections: {},

    //Methods
    joinChannel: function (guild, channelId) {
        const voiceConnection = joinVoiceChannel({
            channelId: channelId,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        });

        module.exports.storedConnections[guild.id] = voiceConnection;

        return voiceConnection;
    },

    leaveChannel: function (guild) {
        let connection = module.exports.storedConnections[guild.id];
        if (connection) {
            connection.destroy();
            module.exports.storedConnections[guild.id] = undefined;
        }
    },


    playSound: function (guild, channelId, soundName) {
        const voiceConnection = module.exports.joinChannel(guild, channelId);

        const player = createAudioPlayer();

        let audioPath = './sounds/' + soundName + '.mp3';
        console.log("playing " + audioPath);
        const resource = createAudioResource(audioPath);

        player.play(resource);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Playing');
        });

        player.on('error', error => {
            console.error(`Error: ${error.message} with resource`);
        });

        voiceConnection.subscribe(player);
    }
}