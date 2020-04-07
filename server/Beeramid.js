const Game = require('./Game')
const BeeramidPlayer = require('./BeeramidPlayer')
const Deck = require('./Deck')

const MAX_PLAYERS = 7
const NAME = 'Beeramid'

module.exports = class Beeramid extends Game {
  constructor(players, hostId, endGame) {
    super(BeeramidPlayer, MAX_PLAYERS, players, hostId, endGame)
    this.deck = new Deck()
    this.pyramid = []
    this.stage = -1
    this.calls = null

    this.deal()
  }

  getName() {
    return NAME
  }

  deal() {

  }

  getAllPlayerInfo() {
    let playerInfo = []
    this.getPlayers().forEach(player => {
      playerInfo.push({
        name: player.getName(),
        isHost: player.getIsHost()
      })
    })
    return playerInfo
  }

  triggerGameUpdate() {
    this.getPlayers().forEach(player => {
      player.gameUpdate({
        players: this.getAllPlayerInfo(),
        name: player.getName(),
        isHost: player.getIsHost()
      })
    })
  }
}
