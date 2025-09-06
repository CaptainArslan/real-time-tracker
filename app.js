const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var count = 0;
io.on('connection', (socket) => {
    count++;
    console.log('A user connected', count);
    socket.on('sendLocation', (data) => {
        console.log('Location update received:', data);
        io.emit('receiveLocation', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        count--;
        console.log('A user disconnected', count);
        io.emit('userDisconnected', socket.id);
    });
});

app.get("/", (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});