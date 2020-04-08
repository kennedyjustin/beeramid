const Game = require('./Game')
const BeeramidPlayer = require('./BeeramidPlayer')
const Deck = require('./Deck')

const NAME = 'Beeramid'
const MAX_PLAYERS = 7
const NUM_CARDS_IN_HAND = 3
const NUM_CARDS_IN_PYRAMID = 12
const FIRST_STAGE_WAIT_TIME_SECONDS = 5
const NORMAL_STAGE_WAIT_TIME_SECONDS = 5

module.exports = class Beeramid extends Game {
  constructor(players, hostId, endGame) {
    super(BeeramidPlayer, MAX_PLAYERS, players, hostId, endGame)
    this.deck = new Deck()
    this.pyramid = []
    this.stage = -1
    this.calls = []
    this.cardsHidden = false

    this.deal()
    setTimeout(() => this.hideCards(), FIRST_STAGE_WAIT_TIME_SECONDS * 1000)
    this.stageStartTime = Date.now()
  }

  getName() {
    return NAME
  }

  deal() {
    this.pyramid = this.deck.getCards(NUM_CARDS_IN_PYRAMID)
    this.getPlayers().forEach(player => {
      player.setCards(this.deck.getCards(NUM_CARDS_IN_HAND))
    })
  }

  hideCards() {
    this.cardsHidden = true
    this.nextStage()
  }

  nextStage() {
    if (this.cardsHidden === false || this.calls.length !== 0 || Date.now() < this.stageStartTime + NORMAL_STAGE_WAIT_TIME_SECONDS * 1000) {
      return
    }

    if (this.stage === NUM_CARDS_IN_PYRAMID) {
      // TODO: Implement guesses
    } else {
      this.stage++
      this.stageStartTime = Date.now()
    }

    this.triggerGameUpdate()
  }

  setCustomEventHandlers(player) {
    player.setNextStage(this.nextStage.bind(this))
    // TODO: Implement Calls
    // TODO: Implement Guesses
  }

  getAllPlayerInfo() {
    let playerInfo = []
    this.getPlayers().forEach(player => {
      playerInfo.push({
        name: player.getName(),
        isHost: player.getIsHost(),
        guesses: this.stage === NUM_CARDS_IN_PYRAMID ? player.getGuesses() : null
      })
    })
    return playerInfo
  }

  triggerGameUpdate() {
    this.getPlayers().forEach(player => {
      player.gameUpdate({
        players: this.getAllPlayerInfo(),
        name: player.getName(),
        isHost: player.getIsHost(),
        cards: this.cardsHidden ? player.getCards().map(() => null) : player.getCards(),
        stage: this.stage,
        pyramid: this.stage === -1 ? [] : this.pyramid.slice(0, Math.min(this.stage, NUM_CARDS_IN_PYRAMID)),
        calls: this.calls
      })
    })
  }
}
