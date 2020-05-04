const GamePlayer = require('./GamePlayer')

module.exports = class BeeramidPlayer extends GamePlayer {
  constructor(player) {
    super(player)
    this.out = false
    this.bottomCards = []
    this.topCards = [null, null, null]
    this.hand = []
    this.ready = false
    this.play = null
    this.pickup = null
    this.sneakIn = null
  }

  setOut(out) {
    this.out = out
  }

  isOut() {
    return this.out
  }

  isReady() {
    return this.ready
  }

  setBottomCards(cards) {
    this.bottomCards = cards
  }

  getBottomCards() {
    return this.bottomCards
  }

  setTopCards(indices) {
    if (this.ready) {
      return
    }
    this.topCards = []
    indices.forEach(index => {
      this.topCards.push(this.hand[index])
    })
    this.removeFromHand(indices)
    this.ready = true
    this.triggerGameUpdate()
  }

  getTopCards() {
    return this.topCards
  }

  getHand() {
    return this.hand
  }

  addToHand(cards) {
    this.hand = this.hand.concat(cards)
  }

  removeFromHand(indices) {
    const newHand = []
    for (let i = 0; i < this.hand.length; i++) {
      if (!indices.includes(i)) {
        newHand.push(this.hand[i])
      }
    }
    this.hand = newHand
  }

  removeFromBottomCards(index) {
    this.bottomCards[index] = null
  }

  removeFromTopCards(index) {
    this.topCards[index] = null
  }

  setflipFirstCard(flipFirstCard) {
    this.flipFirstCard = flipFirstCard
  }

  setPlay(play) {
    this.play = play
  }

  setPickup(pickup) {
    this.pickup = pickup
  }

  setSneakIn(sneakIn) {
    this.sneakIn = sneakIn
  }

  initializeCustomListeners() {
    this.player.getSocket().on('setTopCards', (data) => {
      this.setTopCards(data['indices'])
    })
    this.player.getSocket().on('flipFirstCard', () => {
      this.flipFirstCard(this)
    })
    this.player.getSocket().on('play', (data) => {
      this.play(this, data)
    })
    this.player.getSocket().on('pickup', (data) => {
      this.pickup(this, data)
    })
    this.player.getSocket().on('sneakIn', (data) => {
      this.sneakIn(this, data)
    })
  }

  removeCustomListeners() {
    this.player.getSocket().removeAllListeners(['setTopCards'])
    this.player.getSocket().removeAllListeners(['flipFirstCard'])
    this.player.getSocket().removeAllListeners(['play'])
    this.player.getSocket().removeAllListeners(['pickup'])
    this.player.getSocket().removeAllListeners(['sneakIn'])
  }

}
