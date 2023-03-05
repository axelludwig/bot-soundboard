const guildManager = require("./guild-manager");
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const discordConfig = require("../../discord-config.json");

let cachedChannels = undefined;

exports.getChannels = async function () {
    let myGuild = await guildManager.getCurrentGuild();
    let channels = undefined;
    if (!cachedChannels) {
        channels = await myGuild.channels.fetch();
        cachedChannels = channels;
    }
    else {
        channels = cachedChannels;
    }

    let filteredChannels = [];

    channels.forEach((value, key) => {
        if (value.type === 2) {
            filteredChannels.push(value);
        }
    });

    return filteredChannels.sort(sortChannels);
}
exports.exportChannels = async function () {
    let channels = await exports.getChannels();

    let result = [];
    channels.forEach((value) => {
        let channelObj = exportChannel(value);
        result.push(channelObj);
    });

    return result;
}

exports.getUserChannel = async function (userId) {
    let channels = await exports.getChannels();

    let results = channels.filter(channel =>
        channel.members.some(member =>
            member.user.id === userId
        )
    );

    if (results.length > 0) {
        return results[0];
    }

    return undefined;
}

exports.getCurrentChannel = async function () {
    return await module.exports.getUserChannel(discordConfig.clientId);
}
exports.exportCurrentChannel = async function () {
    let currentChannel = await exports.getCurrentChannel();
    if (!currentChannel) {
        return undefined;
    }

    return exportChannel(currentChannel);
}
exports.joinChannel = async function (channelId) {
    let myGuild = await guildManager.getCurrentGuild();

    const voiceConnection = joinVoiceChannel({
        channelId: channelId,
        guildId: myGuild.id,
        adapterCreator: myGuild.voiceAdapterCreator
    });

    return voiceConnection;
}
exports.leaveChannel = async function () {
    let myGuild = await guildManager.getCurrentGuild();
    let currentConnection = getVoiceConnection(myGuild.id);
    if (currentConnection) {
        currentConnection.destroy();
        console.log("Bot leaved channel");
    }
    else{
        console.log("Bot is not inside a channel");
    }
}

function exportChannel(channel) {
    let channelObj = {};
    channelObj.name = channel.name;
    channelObj.id = channel.id;

    let members = [];
    channel.members.forEach((value) => {
        let member = {}
        member.id = value.id;
        member.name = value.user.username;
        members.push(member);
    });

    channelObj.members = members;

    return channelObj;
}

function sortChannels(a, b) {
    return a.position - b.position;
}