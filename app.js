const express = require('express')
const app = express()
const port = 3000

const SocketApp = express();
const SocketServer = require('http').createServer(SocketApp);
const Socket = require('socket.io')(SocketServer, {
    cors: {
      origin: '*',
    }
});

app.use(express.static('public'))

app.get('/', (req, res) => {
    //serve the index.html file
    res.sendFile(__dirname + '/index.html');
})

Socket.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('reaction', function (type) {
        console.log('reaction' + JSON.stringify(type));

        Socket.emit('reaction', type);

    });
    
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

SocketServer.listen(3001, () => {
    console.log(`Socket server listening on port 3001`)
})