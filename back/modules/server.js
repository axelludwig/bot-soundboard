const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const cors = require('cors');

server.listen(3000, () => {
    console.log('listening on *:3000');
});

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send({ data: 'OK' });
});

app.post('/images', (req, res) => {
    res.send({ data: 'OK' });
});

exports.app = app;
exports.server = server;