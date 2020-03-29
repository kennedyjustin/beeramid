import React, { Component } from 'react';
import io from 'socket.io-client';
import { Navbar } from 'react-bootstrap'
import PreLobby from './PreLobby'
import Lobby from './Lobby'

class App extends Component {
  constructor() {
    super();
    this.state = {
      socket: io(),
      name: null,
      names: [],
      lobby: true
    };

    this.state.socket.on('lobbyUpdate', (data) => this.lobbyUpdate(data))
  }

  lobbyUpdate(data) {
    this.setState({
      names: data.names,
      name: data.name
    })
  }

  render() {
    let game
    if (this.state.lobby) {
      if (this.state.name) {
        game = <Lobby name={this.state.name} names={this.state.names} />
      } else {
        game = <PreLobby socket={this.state.socket} />
      }
    } else {
      game = <div>Beeramid</div>
    }

    return (
      <div>
        <Navbar bg="dark" variant="dark"><Navbar.Brand>
          Beeramid
        </Navbar.Brand></Navbar>
        {game}
      </div>
    )
  }
}

export default App
