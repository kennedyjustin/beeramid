const Game = require('./Game')
const BeeramidPlayer = require('./BeeramidPlayer')

const MAX_PLAYERS = 7
const NAME = 'Beeramid'

module.exports = class Beeramid extends Game {
  constructor(players, hostId, endGame) {
    super(BeeramidPlayer, MAX_PLAYERS, players, hostId, endGame)
  }

  getName() {
    return NAME
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
