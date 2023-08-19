const express = require('express');
const app = express();

const path = require('path');

const  PORT = process.env.PORT || 4000; 
const server = app.listen(PORT, ()=> console.log(`Server on port ${PORT}`))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))


io.on('connection', onConnected)

let socketConnected = new Set();

function onConnected(socket) {
    console.log(socket.id)
    socketConnected.add(socket.id)

    io.emit('clients-total', socketConnected.size)

    socket.on('disconnect', ()=>{
        console.log('Socket Disconnected: ', socket.id)
        socketConnected.delete(socket.id)
        io.emit('clients-total', socketConnected.size)

    })

    socket.on('message', function(data) {
        console.log(data )
        socket.broadcast.emit('chat-message', data);
    })

    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data);
    })

}