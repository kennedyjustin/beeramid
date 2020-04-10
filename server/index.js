const express = require("express")
const http = require("http")
const socketIo = require('socket.io')
const Lobby = require('./Lobby')

let app = express()
let server = http.createServer(app)
let io = socketIo(server)

app.use(express.static('public'))

const lobby = new Lobby()

io.on('connection', (socket) => {
  const uuid = socket.handshake.query.uuid
  let name = socket.handshake.query.name
  if (name === 'null' || name === 'undefined') {
    name = null
  }
  lobby.addPlayer(socket, uuid, name)
  socket.on('disconnect', () => lobby.removePlayer(socket.id))
})

server.listen(3000,  () => console.log("Running Beeramid Server"))
