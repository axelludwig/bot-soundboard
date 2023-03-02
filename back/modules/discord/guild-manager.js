const discordClientManager = require("./discord-client");
const discordConfig = require("../../discord-config.json");

module.exports = {
    getCurrentGuild: async function(){
        let guilds = await discordClientManager.discordClient.guilds.fetch();
        let myGuild = await guilds.get(discordConfig.guildId).fetch();

        return myGuild;
    }
}