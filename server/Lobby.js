const Player = require('./Player')

module.exports = class Lobby {
  constructor() {
    this.players = []
    this.game = null
  }

  addPlayer(socket) {
    this.players.push(new Player(socket, this.triggerLobbyUpdate.bind(this)))

    this.triggerLobbyUpdate()
    console.log("New connection: " + socket.id)
  }

  removePlayer(id) {
    let index
    let name
    this.players.forEach((player, i) => {
      if (player.getId() == id) {
        index = i
        name = player.getName()
      }
    })
    if (index) {
      this.players.splice(index, 1)
    }

    console.log("Player left: " + name + " " + id)
    this.triggerLobbyUpdate()
  }

  getAllPlayerNames() {
    let names = []
    this.players.forEach(player => {
      names.push(player.getName())
    })
    return names
  }

  triggerLobbyUpdate() {
    this.players.forEach(player => {
      player.giveLobbyUpdate({
        names: this.getAllPlayerNames(),
        name: player.getName()
      })
    })
  }

}
