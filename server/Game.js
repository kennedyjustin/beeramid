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
  }

  getHostName() {
    return this.host.getName()
  }

  getPlayers() {
    return this.players
  }

  getPlayerNames() {
    return this.players.map(p => p.getName())
  }

  playerDisconnected(id) {
    const player = this.players.find(p => p.getId() === id)

    if (this.players.length === 0) {
      this.endGame()
    } else {
      if (player.getIsHost()) {
        player.setIsHost(false)
        this.players[0].setIsHost(true)
        this.players[0].setEndGame(this.endGame)
      }
      this.triggerGameUpdate()
    }
  }

  playerReconnected(uuid) {
    const player = this.players.find(p => p.getUuid() === uuid)
    player.initializeListeners()

    this.triggerGameUpdate()
  }

  cleanupGame() {
    this.players.forEach(player => {
      player.removeListeners()
    })
  }
}
