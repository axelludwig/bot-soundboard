const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const channelManager = require('./channel-manager');
const fs = require('fs');
const path = require('path');

exports.playSound = async function (soundName) {
    let channel = await channelManager.getCurrentChannel();

    if (!channel) {
        //Bot not in channel
        console.log("Bot is not inside a channel");
        return;
    }

    let voiceConnection = await channelManager.joinChannel(channel.id);

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

exports.exportSounds = function () {
    let result = [];
    fs.readdirSync(path.join(__dirname, '../../sounds'))
        .forEach(file => {
            result.push(path.parse(file).name);
        });

    return result;
}