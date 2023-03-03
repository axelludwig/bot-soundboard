const guildManager = require('./guild-manager');

let cachedMembers = new Map();

exports.getUserById = async function(userId){
    let guild = await guildManager.getCurrentGuild();
    
    let member = cachedMembers.get(userId);

    if (!member){
        member = await guild.members.fetch(userId);
        
        cachedMembers.set(userId, member);
    }

    return member;
}