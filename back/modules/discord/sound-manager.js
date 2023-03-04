const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const channelManager = require('./channel-manager');
const fs = require('fs');
const path = require('path');

let soundVolume = 1; // entre 0 et 1
let mode = "queue" //overwrite or queue
let queue = [];
let isSoundPlaying = false;

exports.playSound = async function (soundName) {
    let channel = await channelManager.getCurrentChannel();

    if (!channel) {
        //Bot not in channel
        console.log("Bot is not inside a channel");
        return;
    }

    let voiceConnection = await channelManager.joinChannel(channel.id);

    if (mode === "queue") {
        queue.push(soundName);
        if (!isSoundPlaying){
            startSound(soundName, voiceConnection);
        }
    }
    else{
        startSound(soundName, voiceConnection);
    }
}

exports.setVolume = function (newVolume) {
    soundVolume = newVolume;
}

exports.exportSounds = function () {
    let result = [];
    fs.readdirSync(path.join(__dirname, '../../sounds'))
        .forEach(file => {
            result.push(path.parse(file).name);
        });

    return result;
}

exports.setMode = function(newMode){
    if (newMode === "queue" || newMode === "overwrite"){
        mode = newMode;
    }
    else{
        //TOTO erreur mode non reconnu
    }
}

startSound = function (soundName, voiceConnection) {
    const player = createAudioPlayer();

    let audioPath = './sounds/' + soundName + '.mp3';
    console.log("playing " + audioPath);
    const resource = createAudioResource(audioPath, { inlineVolume: true });
    resource.volume.setVolume(soundVolume);

    player.play(resource);
    isSoundPlaying = true;

    player.on('error', error => {
        console.error(`Error: ${error.message} with resource`);
    });

    voiceConnection.subscribe(player);

    if (mode === "queue") {
        player.on(AudioPlayerStatus.Idle, () => {
            //Quand le bot a fini un son
            isSoundPlaying = false;
            queue.shift();
            if (queue[0]){
                startSound(queue[0], voiceConnection);
            }
        });
    }
}