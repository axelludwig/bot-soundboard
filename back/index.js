const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { send } = require('process');
const path = require('node:path');
const fs = require('node:fs');
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const discordConfig = require("./discord-config.json");
require('./commands/ping.js');

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send({ data: 'OK' });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit("connection successful");
    socket.on('disconnect', () => {
        console.log('user disconnected\n');
    });

    socket.on('test', (socket) => {
        console.log("ok test");
        io.emit("restest");
    })
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});

//Discord client setup
const discordClient = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]});

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