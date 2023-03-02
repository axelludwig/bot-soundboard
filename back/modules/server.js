const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send({ data: 'OK' });
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