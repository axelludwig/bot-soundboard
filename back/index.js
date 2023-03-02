const { send } = require('process');
const path = require('node:path');
const fs = require('node:fs');
const serverManager = require('./modules/server')
const socketManager = require('./modules/socket')


const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const discordConfig = require("./discord-config.json");
require('./commands/ping.js');

//Discord client setup
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        discordClient.commands.set(command.data.name, command);
        console.log("Added command " + command.data.name);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

discordClient.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

discordClient.login(discordConfig.BOT_TOKEN);