// dependencias e variaveis
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)
const port = '5500'
  
// arquivos estaticos
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/src'))

// socket
io.on('connection', socket => {
    console.log(socket.id)
    socket.on('disconnect', () => {console.log('desconectou')});

    socket.on('msg', msg => { io.emit('msg', msg) });
    socket.on('drawing', line => { io.emit('drawing', line) });
    socket.on('lineWidth', lineWidth => { io.emit('lineWidth', lineWidth) });
    socket.on('color', color => { io.emit('colorRes', color) });
});

// server
server.listen(port, () => console.log(`Server aberto na porta ${port}`))