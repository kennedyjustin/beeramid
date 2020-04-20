const express = require("express")
const http = require("http")
const socketIo = require('socket.io')
const schedule = require('node-schedule')
const Lobby = require('./Lobby')

let app = express()
let server = http.createServer(app)
let io = socketIo(server)

// Constants
MAX_LOBBIES = 10
MAX_LOBBYNAME_CHARACTERS = 20
ADMIN_NAME = "/admin/"

WHITELISTED_ROUTES = [
  'index.html',
  'favicon.png',
  'bundle.js'
]

ASSETS_ROUTE = "assets"

// Data Structures
const lobbyMap = {}
let dailyActiveUsers = []

// Express Server
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

// Socket IO
io.on('connection', (socket) => {
  // Get Socket Information
  const uuid = socket.handshake.query.uuid
  const lobbyName = socket.handshake.query.lobbyName
  let name = socket.handshake.query.name
  if (name === 'null' || name === 'undefined') {
    name = null
  }

  // Admin Portal Information
  if (lobbyName === ADMIN_NAME) {
    socket.emit('lobbyUpdate', {
      admin: getAdminData()
    })
    return
  }

  // Validation
  if (lobbyName.length > MAX_LOBBYNAME_CHARACTERS) {
    socket.emit('lobbyUpdate', {
      errorMessage: "Lobby name has too many characters, try again."
    })
    return
  }

  // Create Lobby if needed
  if (!lobbyMap[lobbyName]) {
    if (Object.keys(lobbyMap).length >= MAX_LOBBIES && lobbyName !== "/") {
      socket.emit('lobbyUpdate', {
        errorMessage: "Too many lobbies, please try again later."
      })
      return
    } else {
      lobbyMap[lobbyName] = new Lobby(lobbyName, dailyActiveUsers)
    }
  }

  // Add Player to Lobby
  const lobby = lobbyMap[lobbyName]
  lobby.addPlayer(socket, uuid, name)
  socket.on('disconnect', () => {
    lobby.removePlayer(socket.id)
    if (lobby.howManyPlayers() === 0) {
      delete lobbyMap[lobbyName]
    }
  })
})

// Admin Portal Data
function getAdminData() {
  let adminData = {
    lobbies: {},
    dailyActiveUsers: dailyActiveUsers.length
  }
  Object.keys(lobbyMap).forEach(lobby => {
    adminData['lobbies'][lobby] = lobbyMap[lobby].getPlayerList()
  })
  return adminData
}

// Schedules
schedule.scheduleJob('0 4 * * *', () => {
  const date = new Date()
  console.log(dailyActiveUsers.length + ' Daily Active Users on ' + date.toString())
  dailyActiveUsers = []
})

// Run Server
server.listen(3000,  () => console.log("Running Beeramid Server"))
