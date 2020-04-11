const Game = require('./Game')
const BeeramidPlayer = require('./BeeramidPlayer')
const Deck = require('./Deck')

const NAME = 'Beeramid'
const MAX_PLAYERS = 10
const NUM_CARDS_IN_HAND = 3
const NUM_CARDS_IN_PYRAMID = 12
const FIRST_STAGE_WAIT_TIME_SECONDS = 15 // Must be larger than below
const NORMAL_STAGE_WAIT_TIME_SECONDS = 5
const REPLACE_EXPOSED_CARD_WAIT_TIME_SECONDS = 5
const HIDE_REPLACE_CARD_WAIT_TIME_SECONDS = 7

module.exports = class Beeramid extends Game {
  constructor(players, hostId, endGame) {
    super(BeeramidPlayer, MAX_PLAYERS, players, hostId, endGame)
    this.deck = new Deck()
    this.pyramid = []
    this.stage = -1
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
    if (this.cardsHidden === false || this.anyCardsExposedOrNew() || this.waitLongerForNextStage()) {
      return
    }

    this.stage++
    this.stageStartTime = Date.now()

    this.triggerGameUpdate()
  }

  waitLongerForNextStage() {
    if (this.stage === 0) {
      return false
    }
    return Date.now() < this.stageStartTime + NORMAL_STAGE_WAIT_TIME_SECONDS * 1000
  }

  anyCardsExposedOrNew() {
    if (this.deck.isEmpty()) {
      return false
    }

    let anyCards = false
    this.getPlayers().forEach(player => {
      if (player.hasAnyExposedOrNewCards()) {
        anyCards = true
      }
    })
    return anyCards
  }

  exposeCard(player, index) {
    if (this.stage > 0 && !player.isCardExposedOrNew(index)) {
      player.expose(index)
    } else {
      return
    }

    if (this.stage !== NUM_CARDS_IN_PYRAMID && !this.deck.isEmpty()) {
      setTimeout(() => {

        player.replace(index, this.deck.getCards(1))
        setTimeout(() => {

          player.hide(index)
          this.stageStartTime = Date.now()

          this.triggerGameUpdate()

        }, HIDE_REPLACE_CARD_WAIT_TIME_SECONDS * 1000)

        this.triggerGameUpdate()

      }, REPLACE_EXPOSED_CARD_WAIT_TIME_SECONDS * 1000)
    }

    this.triggerGameUpdate()
  }

  setCustomEventHandlers(player) {
    player.setNextStage(this.nextStage.bind(this))
    player.setExposeCard(this.exposeCard.bind(this))
  }

  getAllPlayerInfo(exceptUuid) {
    return this.getPlayers().filter(player => player.getUuid() !== exceptUuid).map(player => {
      return {
        name: player.getName(),
        isHost: player.getIsHost(),
        cards: player.getCards().map(c => (c['expose'] && !c['new']) ? c : null)
      }
    })
  }

  triggerGameUpdate() {
    this.getPlayers().forEach(player => {
      player.gameUpdate({
        players: this.getAllPlayerInfo(player.getUuid()),
        name: player.getName(),
        isHost: player.getIsHost(),
        cards: this.cardsHidden ? player.getCards().map((c) => (c['expose'] || c['new']) ? c : null) : player.getCards(),
        stage: this.stage,
        pyramid: this.stage === -1 ? [] : this.pyramid.slice(0, this.stage),
      })
    })
  }
}
