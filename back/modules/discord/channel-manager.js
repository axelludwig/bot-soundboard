const guildManager = require("./guild-manager");
const { joinVoiceChannel } = require('@discordjs/voice');
const discordConfig = require("../../discord-config.json");

const storedConnections = {};

exports.getChannels = async function () {
    let myGuild = await guildManager.getCurrentGuild();
    let channels = await myGuild.channels.fetch();
    let filteredChannels = [];

    channels.forEach((value, key) => {
        if (value.type ===2){
            filteredChannels.push(value);
        }
    });

    return filteredChannels;
}
exports.exportChannels = async function () {
    let channels = await exports.getChannels();

    let result = [];
    channels.forEach((value) => {
        let channelObj = {};
        channelObj.name = value.name;
        channelObj.id = value.id;
        result.push(channelObj);
    });

    return result;
}

exports.getCurrentChannel = async function () {
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
exports.joinChannel = async function (channelId) {
    let myGuild = await guildManager.getCurrentGuild();

    const voiceConnection = joinVoiceChannel({
        channelId: channelId,
        guildId: myGuild.id,
        adapterCreator: myGuild.voiceAdapterCreator
    });

    storedConnections[myGuild.id] = voiceConnection;

    return voiceConnection;
}
exports.leaveChannel = async function () {
    let myGuild = await guildManager.getCurrentGuild();
    let connection = storedConnections[myGuild.id];
    if (connection) {
        connection.destroy();
        storedConnections[myGuild.id] = undefined;
    }
}