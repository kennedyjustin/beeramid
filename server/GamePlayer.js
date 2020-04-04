module.exports = class GamePlayer {
  constructor(player) {
    this.player = player
    this.isHost = false
    this.endGame = null

    this.player.getSocket().on('endGame', () => {
      if (this.isHost) {
        this.endGame()
      }
    })
  }

  getName() {
    return this.player.getName()
  }

  getId() {
    return this.player.getId()
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

  removeListeners() {
    this.player.getSocket().removeAllListeners(['endGame'])
  }

  gameUpdate(update) {
    this.player.getSocket().emit('gameUpdate', update)
  }
}
