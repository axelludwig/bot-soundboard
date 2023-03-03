const discordClientManager = require("./discord-client");
const discordConfig = require("../../discord-config.json");

exports.getCurrentGuild = async function () {
    let guilds = await discordClientManager.client.guilds.fetch();
    let myGuild = await guilds.get(discordConfig.guildId).fetch();

    return myGuild;
}
