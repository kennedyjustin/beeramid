module.exports = class Game {
  constructor() {
    this.players = []
    this.alpha = null;
  }

  getPlayers() {
    return this.players
  }

  getAlpha() {
    return this.alpha
  }
}
