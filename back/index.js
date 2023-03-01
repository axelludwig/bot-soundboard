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

const {Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const discordConfig = require("./discord-config.json");

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
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
const discordClient = new Client({intents: [GatewayIntentBits.Guilds]});

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
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
 
discordClient.login(discordConfig.BOT_TOKEN);