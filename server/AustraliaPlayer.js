const GamePlayer = require('./GamePlayer')

const RANK_ORDER = ['3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K', 'A', '2', '10']

module.exports = class BeeramidPlayer extends GamePlayer {
  constructor(player) {
    super(player)
    this.won = false
    this.play = null
    this.pickup = null
    this.reset()
  }

  reset() {
    this.won = false
    this.bottomCards = []
    this.topCards = [null, null, null]
    this.hand = []
    this.ready = false
  }

  setWon(won) {
    this.won = won
  }

  getWon() {
    return this.won
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
    this.hand.sort((a, b) => {
      return RANK_ORDER.indexOf(a['rank']) - RANK_ORDER.indexOf(b['rank'])
    })
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

  removeNewFromHand() {
    for (let i = 0; i < this.hand.length; i++) {
      const card = this.hand[i]
      if (card['new']) {
        delete card['new']
      }
    }
  }

  removeFromBottomCards(index) {
    this.bottomCards[index] = null
  }

  removeFromTopCards(index) {
    this.topCards[index] = null
  }

  setClickDeck(clickDeck) {
    this.clickDeck = clickDeck
  }

  checkIfWon() {
    const topCardsEmpty = this.topCards.every(c => c == null)
    const bottomCardsEmpty = this.bottomCards.every(c => c == null)
    if (this.hand.length == 0 && topCardsEmpty && bottomCardsEmpty) {
      return true
    }
    return false
  }

  setPlay(play) {
    this.play = play
  }

  setPickup(pickup) {
    this.pickup = pickup
  }

  initializeCustomListeners() {
    this.player.getSocket().on('setTopCards', (data) => {
      this.setTopCards(data['indices'])
    })
    this.player.getSocket().on('clickDeck', () => {
      this.clickDeck(this)
    })
    this.player.getSocket().on('play', (data) => {
      this.play(this, data)
    })
    this.player.getSocket().on('pickup', (data) => {
      this.pickup(this, data)
    })
  }

  removeCustomListeners() {
    this.player.getSocket().removeAllListeners(['setTopCards'])
    this.player.getSocket().removeAllListeners(['clickDeck'])
    this.player.getSocket().removeAllListeners(['play'])
    this.player.getSocket().removeAllListeners(['pickup'])
  }

}
