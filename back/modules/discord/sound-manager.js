const { createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior  } = require('@discordjs/voice');
const channelManager = require('./channel-manager');
const fs = require('fs');
const path = require('path');
const soundPath = path.join(__dirname, '../../sounds');

let soundVolume = 1; // entre 0 et 1
let mode = "overwrite" //overwrite or queue
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
    fs.readdirSync(soundPath)
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

exports.renameSound = function (name, newName){
    if (!exports.exportSounds().includes(name)){
        console.log("Sound " + name + "not found"); 
        return;
    }
    let filePath = path.join(soundPath, newName + ".mp3");
    let newPath = path.join(soundPath, newName + ".mp3");
    fs.renameSync(filePath, newPath);
}

startSound = function (soundName, voiceConnection) {
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

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