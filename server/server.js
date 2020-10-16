var express = require('express');
var app = express();
var server = require('http').createServer();
var io = require('socket.io')(server);

server.listen(8080);
console.log("fyt7uijhbg")
io.on('connection', function (socket) {
  console.log("connected")
    socket.on('join', function (data) {
        socket.join(data.roomId);
        socket.room = data.roomId;
        console.log("join")
        const sockets = io.of('/').in().adapter.rooms[data.roomId];
        if(sockets.length===1){
            socket.emit('init')
            console.log("init")
        }else{
            if (sockets.length===2){
                io.to(data.roomId).emit('ready')
            }else{
                socket.room = null
                socket.leave(data.roomId)
                socket.emit('full')
                console.log("full")
            }

        }
    });
    socket.on('signal', (data) => {
        io.to(data.room).emit('desc', data.desc)
        console.log("desc")
    })
    socket.on('disconnect', () => {
        const roomId = Object.keys(socket.adapter.rooms)[0]
        if (socket.room){
            io.to(socket.room).emit('disconnected')
            console.log("disconnected")
        }

    })
});
