const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const SUITS = ['S', 'H', 'C', 'D']

module.exports = class Deck {
  constructor(shuffleBackInDiscardPile) {
    this.cards = []
    this.discardPile = []
    this.shuffleBackInDiscardPile = shuffleBackInDiscardPile
    this.initializeDeck()
    this.shuffle()
  }

  initializeDeck() {
    RANKS.forEach(rank => {
      SUITS.forEach(suit => {
        this.cards.push({
          rank: rank,
          suit: suit
        })
      })
    })
  }

  shuffle() {
    let j, x, i
    for (let i = this.cards.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = this.cards[i]
      this.cards[i] = this.cards[j]
      this.cards[j] = x
    }
  }

  cardsLeft() {
    return this.cards.length
  }

  getCards(n) {
    if (this.isEmpty() && this.shuffleBackInDiscardPile == true) {
      this.shuffleBackIn()
    }

    if (n === 1) {
      return this.cards.pop()
    } else {
      let cards = []
      Array.from(Array(n)).map((_, i) => {
        cards.push(this.cards.pop())
      })
      return cards
    }
  }

  addToDiscardPile(card) {
    this.discardPile.push(card)
  }

  shuffleBackIn() {
    this.cards = this.discardPile.slice()
    this.discardPile = []
    this.shuffle()
  }

  isEmpty() {
    return this.cards.length === 0
  }

  isReallyEmpty() {
    return this.cards.length === 0 && this.discardPile.length === 0
  }

  getRanks() {
    return RANKS
  }
}
