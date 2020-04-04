const MAX_NAME_LENGTH = 20

module.exports = class Player {
  constructor(socket, triggerLobbyUpdate, startGame) {
    this.socket = socket
    this.name = null
    this.id = socket.id
    this.inGame = false
    this.triggerLobbyUpdate = triggerLobbyUpdate
    this.startGame = startGame

    socket.on('name', (data) => this.setName(data.name))
    socket.on('startGame', (data) => this.startGame(data.game, this.id))
  }

  getSocket() {
    return this.socket
  }

  getName() {
    return this.name
  }

  setName(name) {
    if (name && name.length > MAX_NAME_LENGTH) {
      this.name = name.substring(0, MAX_NAME_LENGTH)
    } else if (name && name.length !== 0) {
      this.name = name
    }

    console.log("New Player: " + this.name + " (Connection: " + this.id + ")")
    this.triggerLobbyUpdate()
  }

  getId() {
    return this.id
  }

  getInGame() {
    return this.inGame
  }

  setInGame(inGame) {
    this.inGame = inGame
  }

  isReady() {
    return this.name !== null
  }

  giveLobbyUpdate(update) {
    this.getSocket().emit('lobbyUpdate', update)
  }
}
