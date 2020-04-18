const Player = require('./Player')
const Beeramid = require('./Beeramid')

const LOBBY_PREFIX = 'LOBBY'
const MAX_LOBBY_MEMBERS = 10

module.exports = class Lobby {
  constructor(name) {
    this.name = name
    this.players = []
    this.game = null
    this.gamePlaying = false
  }

  addPlayer(socket, uuid, name) {
    this.logPlayer('Adding player to lobby', socket.id, uuid, name)

    const existingPlayer = this.players.find(p => p.getUuid() === uuid)
    if (existingPlayer) {
      existingPlayer.setConnected(true)
      existingPlayer.setSocket(socket)
      existingPlayer.initializeListeners()
      this.triggerLobbyUpdate()
      this.logPlayer('Player already exists, reset socket', socket.id, uuid, name)
      if (this.gamePlaying && existingPlayer.getInGame()) {
        this.game.playerReconnected(uuid)
        this.logPlayer('Reconnected player to game', socket.id, uuid, name)
      }
      return
    }

    if (this.players.length >= MAX_LOBBY_MEMBERS) {
      socket.emit('lobbyUpdate', {
        errorMessage: "Too many players, please try again later."
      })
      socket.disconnect(true)
      this.logPlayer('Too many players in lobby, rejecting connection', socket.id, uuid, name)
      return
    }

    this.players.push(new Player(
      socket,
      uuid,
      name,
      this.triggerLobbyUpdate.bind(this),
      this.startGame.bind(this)
    ))
    this.logPlayer('Added player to lobby', socket.id, uuid, name)

    this.triggerLobbyUpdate()
  }

  removePlayer(id) {
    const index = this.players.findIndex(p => p.getId() === id)
    const player = this.players.find(p => p.getId() === id)

    if (index >= 0) {

      if (this.gamePlaying && player.getInGame()) {
        player.setConnected(false)
        this.game.playerDisconnected(id)
        this.logPlayer('Disconnected player from on-going game', id, player.getUuid(), player.getName())
      } else {
        this.players[index].removeListeners()
        this.players.splice(index, 1)
        this.logPlayer('Removed player from lobby', id, player.getUuid(), player.getName())
      }
    }

    this.triggerLobbyUpdate()
  }

  howManyPlayers() {
    return this.players.length
  }

  getPlayerList() {
    return this.players.map(player => player.getName())
  }

  getAllPlayerInfo() {
    let players = []
    this.players.forEach(player => {
      players.push({
        name: player.getName(),
        inGame: player.getInGame()
      })
    })
    return players
  }

  triggerLobbyUpdate() {
    this.players.forEach(player => {
      player.giveLobbyUpdate({
        players: this.getAllPlayerInfo(),
        name: player.getName(),
        inGame: player.getInGame(),
        gamePlaying: this.gamePlaying,
        gameType: this.gamePlaying ? this.game.getName() : null,
        tooManyPlayers: false
      })
    })
  }

  startGame(gameName, hostId) {
    let game
    switch(gameName) {
      case 'Beeramid':
        game = Beeramid
        break
      default:
    }

    if (game) {
      this.gamePlaying = true
      this.game = new game(this.players, hostId, this.endGame.bind(this))

      console.log(
        LOBBY_PREFIX + ' - Started game:\n' +
        '\tLobbyName ' + this.name + '\n' +
        '\tType: ' + gameName + '\n' +
        '\tHost: ' + this.game.getHostName() + '\n' +
        '\tPlayers: ' + this.game.getPlayerNames()
      )

      this.triggerLobbyUpdate()
      this.game.triggerGameUpdate()
    }
  }

  endGame() {
    if (!this.gamePlaying) {
      return
    }

    const name = this.game.getName()
    this.gamePlaying = false
    this.game.cleanupGame()
    this.players.slice().forEach(player => {
      player.setInGame(false)
      if (!player.getConnected()) {
        this.removePlayer(player.getId())
      }
    })
    this.game = null
    console.log(
      LOBBY_PREFIX + ' - Ended game:\n' +
      '\tLobbyName ' + this.name + '\n' +
      '\tType: ' + name
    )

    this.triggerLobbyUpdate()
  }

  logPlayer(logString, socketId, uuid, name) {
    console.log(
      LOBBY_PREFIX + ' - ' + logString + ':\n' +
      '\tLobbyName ' + this.name + '\n' +
      '\tSocket ID: ' + socketId + '\n' +
      '\tUUID: ' + uuid + '\n' +
      '\tName: ' + name
    )
  }

}
