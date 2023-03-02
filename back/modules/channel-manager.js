const discordClientManager = require("./discord-client");
const discordConfig = require("../discord-config.json");

module.exports = {
    getChannels: async function () {
        let guilds = await discordClientManager.discordClient.guilds.fetch();
        let myGuild = await guilds.get(discordConfig.guildId).fetch();
        let channels = await myGuild.channels.fetch();
        
        let result = [];
        channels.forEach((value, key) => {
            if (value.type === 2){
                let channelObj = {};
                channelObj.name = value.name;
                channelObj.id = key;
                result.push(channelObj);
            }
        });

        return result;
    },
}