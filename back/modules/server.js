const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const channelManager = require('./discord/channel-manager');
const soundManager = require('./discord/sound-manager');


app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));

app.get('/', (req, res) => {
    res.send({ data: 'OK' });
});

app.get('/channels', (req, res) => {
    channelManager.exportChannels().then((channels => {
        res.send(JSON.stringify(channels))
    }));
});

app.get('/currentChannel', (req, res) => {
    channelManager.exportCurrentChannel().then((channel => {
        res.send(JSON.stringify(channel))
    }));
});

app.get('/sounds', (req, res) => {
    res.send(JSON.stringify(soundManager.exportSounds()));
});

app.post('/sounds', (req, res) => {
    var soundPath = path.join(__dirname, process.env.soundsFolder, req.body.name);
    require("fs").writeFile(soundPath, req.body.data, 'base64', () => {
        res.send({ data: 'file saved successfully' });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

exports.app = app;
exports.server = server;