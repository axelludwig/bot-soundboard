const { createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, getVoiceConnection  } = require('@discordjs/voice');
const channelManager = require('./channel-manager');
const fs = require('fs');
const path = require('path');
const soundPath = path.join(__dirname, '../../sounds');

let soundVolume = 1; // entre 0 et 1
let mode = "overwrite" //overwrite or queue
let queue = [];
let isSoundPlaying = false;

let globalPlayer = undefined;
let globalResource = undefined;

exports.playSound = async function (soundName) {
    let channel = await channelManager.getCurrentChannel();

    if (!channel) {
        //Bot not in channel
        console.log("Bot is not inside a channel");
        return;
    }

    let voiceConnection = getVoiceConnection(channel.guildId);
    if (!voiceConnection){
        voiceConnection = await channelManager.joinChannel(channel.id);
    }

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
    if (globalResource){
        globalResource.volume.setVolume(soundVolume);
    }
    console.log("Volume set to " + soundVolume);
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

exports.getVolume = function(){
    return soundVolume;
}

exports.getMode = function(){
    return mode;
}

exports.pauseSound = function(){
    if (!globalPlayer){
        return;
    }
    console.log("Pausing sound");
    globalPlayer.pause();
}

exports.unpauseSound = function(){
    if (!globalPlayer){
        return;
    }
    console.log("Unpause sound");
    globalPlayer.unpause();
}


startSound = function (soundName, voiceConnection) {
    if (!globalPlayer){
        globalPlayer = createMyAudioPlayer();
    }

    globalResource = createMyAudioResource(soundName);

    globalPlayer.play(globalResource);
    isSoundPlaying = true;

    globalPlayer.on('error', error => {
        console.error(`Error: ${error.message} with resource`);
        globalPlayer.stop();
        globalPlayer = undefined;
        globalResource = undefined;
        isSoundPlaying = false;
    });

    console.log("playing '" + soundName + "'");
    voiceConnection.subscribe(globalPlayer);

    if (mode === "queue") {
        globalPlayer.on(AudioPlayerStatus.Idle, () => {
            //Quand le bot a fini un son
            globalPlayer.stop();
            globalPlayer = undefined;
            globalResource = undefined;
            isSoundPlaying = false;
            queue.shift();
            if (queue[0]){
                startSound(queue[0], voiceConnection);
            }
        });
    }
}

function createMyAudioPlayer(){
    let player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });

    return player;
}

function createMyAudioResource(soundName){
    let audioPath = './sounds/' + soundName + '.mp3';
    let resource = createAudioResource(audioPath, { inlineVolume: true });
    resource.volume.setVolume(soundVolume);

    return resource;
}