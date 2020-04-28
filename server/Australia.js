const Game = require('./Game')
const AustraliaPlayer = require('./AustraliaPlayer')
const Deck = require('./Deck')

const NAME = 'Australia'
const MAX_PLAYERS = 5
const NUM_BOTTOM_CARDS = NUM_TOP_CARDS = MIN_CARDS_IN_HAND = 3
const TAKE = 'take'
const LEAVE = 'leave'

module.exports = class Australia extends Game {
  constructor(players, hostId, endGame) {
    super(AustraliaPlayer, MAX_PLAYERS, players, hostId, endGame)
    this.deck = new Deck(false)
    this.round = this.getPlayers().length
    //TODO: Implement rounds
    this.firstCardFlipped = false
    this.pickupPile = []
    this.currentPlayer = null
    this.previousPlayer = null

    this.deal()
  }

  getName() {
    return NAME
  }

  deal() {
    this.getPlayers().forEach(player => {
      player.setBottomCards(this.deck.getCards(NUM_BOTTOM_CARDS))
      player.addToHand(this.deck.getCards(NUM_TOP_CARDS + MIN_CARDS_IN_HAND))
    })
  }

  flipFirstCard(player) {
    if (player.isReady() && !this.firstCardFlipped) {
      this.pickupPile.push(this.deck.getCards(1))
      this.firstCardFlipped = true
      this.triggerGameUpdate()
    }
  }

  play(player, cards) {
    if (!player.isReady()) {
      return
    }
    this.setCurrentPlayerIfFirstCard(player)

    //TODO: check all cards are the same
    //TODO: check card type is greater than the card type of pickupPile
    //TODO: Place all cards on pickupPile, remove from Hand
    //TODO: Clear pickup Pile if applicable
    //TODO: If deck left add back into hand
    //TODO: Check if player won, and if game is over
    //TODO: If not 2, 10, or clear, set next() (unless player is out)

    this.triggerGameUpdate()
  }

  sneakIn(player, cards) {
    if (!player.isReady() || !player.getUuid() === this.previousPlayer) {
      return
    }

    //TODO: Implement
  }

  pickup(player) {
    if (!player.isReady()) {
      return
    }
    this.setCurrentPlayerIfFirstCard(player)
    if (player.getUuid() === this.currentPlayer && !this.pickupPile.length == 0) {
      player.addToHand(this.pickupPile.slice())
      this.pickupPile = []
      this.next()
      this.triggerGameUpdate()
    }
  }

  setCurrentPlayerIfFirstCard(player) {
    if (this.currentPlayer === null && this.previousPlayer === null) {
      this.currentPlayer = player.getUuid()
    }
  }

  next() {
    let currentPlayerFound = false
    let index = -1
    while (true) {
      index++
      if (index == this.getPlayers().length) {
        index = 0
      }

      if (this.getPlayers()[index].getUuid() === this.currentPlayer) {
        currentPlayerFound = true
        continue
      } else if (currentPlayerFound && !this.getPlayers()[index].isOut()) {
        this.previousPlayer = this.currentPlayer.slice()
        this.currentPlayer = this.getPlayers()[index].getUuid()
        break
      }
    }
  }

  setCustomEventHandlers(player) {
    player.setflipFirstCard(this.flipFirstCard.bind(this))
    player.setPlay(this.play.bind(this))
    player.setPickup(this.pickup.bind(this))
    player.setSneakIn(this.sneakIn.bind(this))
  }

  getAllPlayerInfo(exceptUuid) {
    return this.getPlayers().filter(player => player.getUuid() !== exceptUuid).map(player => {
      return {
        name: player.getName(),
        topCards: player.getTopCards(),
        currentPlayer: (player.getUuid() === this.currentPlayer),
        previousPlayer: (player.getUuid() === this.previousPlayer)
      }
    })
  }

  triggerGameUpdate() {
    this.getPlayers().forEach(player => {
      player.gameUpdate({
        players: this.getAllPlayerInfo(player.getUuid()),
        name: player.getName(),
        isHost: player.getIsHost(),
        hand: player.getHand(),
        deckLeft: this.deck.cardsLeft(),
        pickupPile: this.pickupPile,
        topCards: player.getTopCards(),
        currentPlayer: (player.getUuid() === this.currentPlayer),
        previousPlayer: (player.getUuid() === this.previousPlayer),
        ready: player.isReady()
      })
    })
  }
}
