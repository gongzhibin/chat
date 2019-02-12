const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();
// user hits the refresh button or is directly accessing a page other than the landing page on history mode
app.use(history({
    index: 'index.html'
}));
app.use(express.static(path.resolve('dist')));

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const nickNameList = {};

io.on('connection', (socket) => {
    let nickName = '';
    socket.on('setNickName', (name) => {
        nickName = name;
        if (nickNameList[nickName]) {
            io.emit('logIn', { status: false });
        } else {
            nickNameList[nickName] = 'online';
            io.emit('logIn',  { status: true, nickName, nickNameList });
            socket.broadcast.emit('userLogIn', nickName);
        }
    });

    socket.on('sendMsg', (msg) => {
        io.emit('receiveMsg', { name: nickName, msg });
    });
    socket.on('disconnect', () => {
        nickNameList[nickName] = 'offline';
        io.emit('userLogout', nickName, nickNameList);
    });
});

http.listen(12345, () => {
    console.log('listening on *:12345');
});