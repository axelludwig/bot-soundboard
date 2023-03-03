const discordClientManager = require("./discord-client");
const discordConfig = require("../../discord-config.json");

let cachedGuild = undefined;

exports.getCurrentGuild = async function () {
    if (!cachedGuild){
        let guilds = await discordClientManager.client.guilds.fetch();
        let myGuild = await guilds.get(discordConfig.guildId).fetch();

        cachedGuild = myGuild;
        return myGuild;
    }
    else{
        console.log("Guild found in cache");
        return cachedGuild;
    }
}
