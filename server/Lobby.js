const Player = require('./Player')
const Beeramid = require('./Beeramid')

const MAX_LOBBY_MEMBERS = 10

module.exports = class Lobby {
  constructor() {
    this.players = []
    this.game = null
    this.gamePlaying = false
  }

  addPlayer(socket) {
    if (this.players.length >= MAX_LOBBY_MEMBERS) {
      socket.emit('lobbyUpdate', {
        tooManyPlayers: true
      })
      socket.disconnect(true)
      return
    }

    this.players.push(new Player(
      socket,
      this.triggerLobbyUpdate.bind(this),
      this.startGame.bind(this)
    ))

    console.log("New Connection: " + socket.id)
    this.triggerLobbyUpdate()
  }

  removePlayer(id) {
    if (this.gamePlaying) {
      this.game.removePlayer(id)
    }

    let index = -1
    let name
    this.players.forEach((player, i) => {
      if (player.getId() == id) {
        index = i
        name = player.getName()
      }
    })
    if (index >= 0) {
      this.players.splice(index, 1)
    }

    console.log("Player left: " + name + " (Connection: " + id + ")")
    this.triggerLobbyUpdate()
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
      console.log('Starting Game: ' + gameName)

      this.gamePlaying = true
      this.game = new game(this.players, hostId, this.endGame.bind(this))

      this.triggerLobbyUpdate()
      this.game.triggerGameUpdate()
    }
  }

  endGame() {
    if (!this.gamePlaying) {
      return
    }

    console.log('Ending Game: ' + this.game.getName())

    this.gamePlaying = false
    this.game.cleanupGame()
    this.players.forEach(player => {
      player.setInGame(false)
    })
    this.game = null

    this.triggerLobbyUpdate()
  }

}
