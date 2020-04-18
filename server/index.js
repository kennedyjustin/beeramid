const express = require("express")
const http = require("http")
const socketIo = require('socket.io')
const Lobby = require('./Lobby')

let app = express()
let server = http.createServer(app)
let io = socketIo(server)

MAX_LOBBIES = 10

WHITELISTED_ROUTES = [
  'index.html',
  'favicon.png',
  'bundle.js'
]

ASSETS_ROUTE = "assets"

app.get('/(:lobby)?(/*)?', function(req, res){
    let lobbyName = req.params.lobby
    let path = req.params[0]

    // ex: https://beeramid.beer/bundle.js
    if (WHITELISTED_ROUTES.includes(lobbyName)) {
      path = lobbyName
      lobbyName = "/"
      return res.sendFile(path, { root: './public' })
    }

    // ex: https://beeramid.beer/assets/felt.jpg
    if (lobbyName && lobbyName.startsWith(ASSETS_ROUTE)) {
      path = ASSETS_ROUTE + "/" + path
      lobbyName = "/"
      return res.sendFile(path, { root: './public' })
    }

    // ex: https://beeramid.beer/foo
    if (lobbyName !== undefined && path === undefined) {
      return res.redirect(301, lobbyName + "/")
    }

    path = path ? path : "/"

    // ex: https://beeramid.beer/foo/bar
    if (path !== "/") {
      return res.redirect(301, "/")
    }

    // ex: https://beeramid.beer, https://beeramid.beer/, https://beeramid.beer/foo/
    res.sendFile(path, { root: './public' })
});

const lobbyMap = {}

io.on('connection', (socket) => {
  const uuid = socket.handshake.query.uuid
  const lobbyName = socket.handshake.query.lobbyName
  let name = socket.handshake.query.name
  if (name === 'null' || name === 'undefined') {
    name = null
  }

  if (!lobbyMap[lobbyName]) {
    if (Object.keys(lobbyMap).length >= MAX_LOBBIES && lobbyName !== "/") {
      socket.emit('lobbyUpdate', {
        tooManyLobbies: true
      })
      return
    } else {
      lobbyMap[lobbyName] = new Lobby(lobbyName)
    }
  }

  const lobby = lobbyMap[lobbyName]
  lobby.addPlayer(socket, uuid, name)
  socket.on('disconnect', () => {
    lobby.removePlayer(socket.id)
    if (lobby.howManyPlayers() === 0) {
      delete lobbyMap[lobbyName]
    }
  })
})

server.listen(3000,  () => console.log("Running Beeramid Server"))
