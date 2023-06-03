const express = require('express')
const app = express()
const port = 3001

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

function generateRandom(min = 0, max = 100) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;

    return rand;
}

let listeners_3rdparty = 0;

setInterval(() => {
    listeners_3rdparty = generateRandom(6, 17);
}, 20000);

Socket.on('connection', function (socket) {
    console.log('a user connected');
    console.log(socket.client.conn.server.clientsCount)

    Socket.emit('live_listeners',(socket.client.conn.server.clientsCount + listeners_3rdparty));

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('reaction', function (type) {
        console.log('reaction' + JSON.stringify(type));

        Socket.emit('reaction', type);

    });
    
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

SocketServer.listen(3002, () => {
    console.log(`Socket server listening on port 3002`)
})