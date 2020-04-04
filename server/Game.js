module.exports = class Game {
  constructor(playerType, maxPlayers, players, hostId, endGame) {
    this.host = null

    this.players = []
    players.forEach(player => {

      if (this.players.length >= maxPlayers) {
        if (!this.host) {
          this.players[0].setIsHost(true)
          this.players[0].setEndGame(this.endGame)
        }
        return
      }

      if (player.isReady()) {
        player.setInGame(true)
      } else {
        return
      }

      let specificPlayer = new playerType(player)
      if (player.getId() === hostId) {
        specificPlayer.setIsHost(true)
        specificPlayer.setEndGame(endGame)
        this.host = specificPlayer
      }
      this.players.push(specificPlayer)
    })

    this.endGame = endGame

    console.log(
      'Started Game: ' + this.getName() + '\n' +
      '\tPlayers: ' + this.players.map(p => p.getName()) + '\n' +
      '\tHost: ' + this.host.getName())
  }

  getPlayers() {
    return this.players
  }

  removePlayer(id) {
    let index
    let name
    let wasHost
    this.players.forEach((player, i) => {
      if (player.getId() == id) {
        index = i
        name = player.getName()
        wasHost = true
      }
    })
    if (index) {
      this.players.splice(index, 1)
    }

    if (this.players.length === 0) {
      this.endGame()
    } else {
      if (wasHost) {
        this.players[0].setIsHost(true)
        this.players[0].setEndGame(this.endGame)
      }
      this.triggerGameUpdate()
    }
  }

  cleanupGame() {
    this.players.forEach(player => {
      player.removeListeners()
    })
  }
}
