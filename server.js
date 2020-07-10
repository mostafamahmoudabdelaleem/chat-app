const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');
const {
    joinUser,
    getCurrentUser,
    userLeft,
    getRoomUsers
} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const appName = process.env.APPNAME || "ChatApp";

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.name,msg));
    });

    socket.on('joinRoom', ({username, room}) => {
        const user = joinUser(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(appName, 'Welcome to ChatApp'));

        socket.broadcast.to(user.room).emit('message', formatMessage(appName, `${user.name} has joined the room.`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('disconnect', () => {
        const user = userLeft(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(appName, `${user.name} left the room.`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});



server.listen(port, () => console.log(`[Chat-App Server]: Server running on port <${port}>.`))