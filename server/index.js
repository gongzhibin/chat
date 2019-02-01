const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();
app.use(express.static(path.resolve('dist')));
app.use(history({
    index: '/index.html'
}));

const http = require('http').createServer(app);
const io = require('socket.io')(http);

let nickNameList = new Set([]);

io.on('connection', (socket) => {
    let nickName = '';
    socket.on('setNickName', (name) => {
        nickName = name;
        if (nickNameList.has(nickName)) {
            socket.emit('logIn', { status: false });
        } else {
            nickNameList.add(nickName);
            socket.emit('logIn',  { status: true, nickName });
            socket.broadcast.emit('userLogIn', nickName);
        }
    });

    socket.on('sendMsg', (msg) => {
        io.emit('receiveMsg', { name: nickName, msg });
    });
    socket.on('disconnect', () => {
        io.emit('userLogout', nickName);
    });
});

http.listen(12345, () => {
    console.log('listening on *:12345');
});