const MAX_NAME_LENGTH = 12

module.exports = class Player {
  constructor(socket, triggerLobbyUpdate) {
    this.socket = socket
    this.name = null
    this.id = socket.id
    this.triggerLobbyUpdate = triggerLobbyUpdate

    socket.on('name', (data) => this.setName(data.name))
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

    console.log("New Player: " + this.name)
    this.triggerLobbyUpdate()
  }

  getId() {
    return this.id
  }

  giveLobbyUpdate(update) {
    this.socket.emit('lobbyUpdate', update)
  }
}
