const GamePlayer = require('./GamePlayer')

module.exports = class BeeramidPlayer extends GamePlayer {
  constructor(player) {
    super(player)
    this.cards = []
    this.guesses = []
    this.nextStage = null
  }

  setCards(cards) {
    this.cards = cards
  }

  getCards() {
    return this.cards
  }

  getGuesses() {
    // TODO: Implement guesses
    return null
  }

  setNextStage(nextStage) {
    this.nextStage = nextStage
  }

  initializeCustomListeners() {
    this.player.getSocket().on('nextStage', () => {
      if (this.isHost) {
        this.nextStage()
      }
    })
    // TODO: Implement Calls
    // TODO: Implement Guesses
  }

  removeCustomListeners() {
    this.player.getSocket().removeAllListeners(['nextStage'])
    // TODO: Implement Calls
    // TODO: Implement Guesses
  }

}
