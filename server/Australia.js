const Game = require('./Game')
const AustraliaPlayer = require('./AustraliaPlayer')
const Deck = require('./Deck')

const NAME = 'Australia'
const MAX_PLAYERS = 5

module.exports = class Australia extends Game {
  constructor(players, hostId, endGame) {
    super(AustraliaPlayer, MAX_PLAYERS, players, hostId, endGame)
    this.deck = new Deck(false)
    this.round = this.getPlayers().length
    this.pickupPile = []
    this.currentPlayer = this.getPlayers()[0]
    this.previousPlayer = null

    this.deal()
  }

  getName() {
    return NAME
  }

  kickLoser() {

  }

  setCustomEventHandlers(player) {

  }

  getAllPlayerInfo(exceptUuid) {
    return this.getPlayers().filter(player => player.getUuid() !== exceptUuid).map(player => {
      return {
        name: player.getName()
      }
    })
  }

  triggerGameUpdate() {
    this.getPlayers().forEach(player => {
      player.gameUpdate({
        players: this.getAllPlayerInfo(player.getUuid()),
        name: player.getName(),
        isHost: player.getIsHost()
      })
    })
  }
}
