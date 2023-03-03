const guildManager = require("./guild-manager");
const { joinVoiceChannel } = require('@discordjs/voice');
const discordConfig = require("../../discord-config.json");

const storedConnections = {};
let cachedChannels = undefined;

module.exports.getChannels = async function () {
    let myGuild = await guildManager.getCurrentGuild();
    let channels = undefined;
    if (!cachedChannels) {
        channels = await myGuild.channels.fetch();
        cachedChannels = channels;
    }
    else {
        console.log("Channels found in cache");
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
module.exports.exportChannels = async function () {
    let channels = await exports.getChannels();

    let result = [];
    channels.forEach((value) => {
        let channelObj = exportChannel(value);
        result.push(channelObj);
    });

    return result;
}

module.exports.getCurrentChannel = async function () {
    let channels = await exports.getChannels();

    let results = channels.filter(channel =>
        channel.members.some(member =>
            member.user.id === discordConfig.clientId
        )
    );

    if (results.length > 0) {
        return results[0];
    }

    return undefined;
}
module.exports.exportCurrentChannel = async function () {
    let currentChannel = await exports.getCurrentChannel();
    if (!currentChannel) {
        return undefined;
    }

    return exportChannel(currentChannel);
}
module.exports.joinChannel = async function (channelId) {
    let myGuild = await guildManager.getCurrentGuild();

    const voiceConnection = joinVoiceChannel({
        channelId: channelId,
        guildId: myGuild.id,
        adapterCreator: myGuild.voiceAdapterCreator
    });

    storedConnections[myGuild.id] = voiceConnection;

    return voiceConnection;
}
module.exports.leaveChannel = async function () {
    let myGuild = await guildManager.getCurrentGuild();
    let connection = storedConnections[myGuild.id];
    if (connection) {
        connection.destroy();
        storedConnections[myGuild.id] = undefined;
    }
}

function exportChannel(channel) {
    let channelObj = {};
    channelObj.name = channel.name;
    channelObj.id = channel.id;

    return channelObj;
}

function sortChannels(a, b) {
    return a.position - b.position;
}