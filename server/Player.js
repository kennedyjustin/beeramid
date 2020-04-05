const PLAYER_PREFIX = 'PLAYER'
const MAX_NAME_LENGTH = 20

module.exports = class Player {
  constructor(socket, uuid, name, triggerLobbyUpdate, startGame) {
    this.socket = socket
    this.name = name
    this.id = socket.id
    this.uuid = uuid
    this.inGame = false
    this.triggerLobbyUpdate = triggerLobbyUpdate
    this.startGame = startGame

    this.initializeListeners()
  }

  getSocket() {
    return this.socket
  }

  setSocket(socket) {
    this.socket = socket
    this.id = socket.id
  }

  initializeListeners() {
    this.socket.on('name', (data) => this.setName(data.name))
    this.socket.on('startGame', (data) => this.startGame(data.game, this.id))
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

    console.log(
      PLAYER_PREFIX + ' - Setting name for player:\n' +
      '\tSocket ID: ' + this.id + '\n' +
      '\tUUID: ' + this.uuid + '\n' +
      '\tName: ' + this.name
    )
    this.triggerLobbyUpdate()
  }

  getId() {
    return this.id
  }

  getUuid() {
    return this.uuid
  }

  getInGame() {
    return this.inGame
  }

  setInGame(inGame) {
    this.inGame = inGame
  }

  isReady() {
    return this.name != null
  }

  giveLobbyUpdate(update) {
    this.getSocket().emit('lobbyUpdate', update)
  }

}
