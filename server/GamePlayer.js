module.exports = class GamePlayer {
  constructor(player) {
    this.player = player
    this.isHost = false
    this.endGame = null
    this.connected = true

    this.initializeListeners()
  }

  getName() {
    return this.player.getName()
  }

  getId() {
    return this.player.getId()
  }

  getUuid() {
    return this.player.getUuid()
  }

  getIsHost() {
    return this.isHost
  }

  setIsHost(isHost) {
    this.isHost = isHost
  }

  setEndGame(endGame) {
    this.endGame = endGame
  }

  getPlayer() {
    return this.player
  }

  initializeListeners() {
    this.player.getSocket().on('endGame', () => {
      if (this.isHost) {
        this.endGame()
      }
    })
    this.initializeCustomListeners()
  }

  removeListeners() {
    this.player.getSocket().removeAllListeners(['endGame'])
    this.removeCustomListeners()
  }

  gameUpdate(update) {
    console.log('updating: ' + this.player.getName())
    this.player.getSocket().emit('gameUpdate', update)
  }
}
