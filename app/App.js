import React, { Component } from 'react';
import io from 'socket.io-client';
import { Navbar, Container, Row, Col } from 'react-bootstrap'
import PreLobby from './PreLobby'
import Lobby from './Lobby'
import Beeramid from './Beeramid'

class App extends Component {
  constructor() {
    super();
    this.state = {
      socket: io(),
      name: null,
      players: [],
      gamePlaying: false,
      inGame: false,
      gameType: 'null',
      tooManyPlayers: false
    };

    this.state.socket.on('lobbyUpdate', (data) => this.lobbyUpdate(data))
  }

  lobbyUpdate(data) {
    this.setState({
      players: data.players,
      name: data.name,
      gamePlaying: data.gamePlaying,
      inGame: data.inGame,
      gameType: data.gameType,
      tooManyPlayers: data.tooManyPlayers
    })
  }

  render() {
    let game
    if (this.state.tooManyPlayers) {
      game = (
        <Container fluid>
          <Row>
            <Col>
              <p>Too many players, please try again later.</p>
            </Col>
          </Row>
        </Container>
      )
    } else if (!this.state.inGame) {
      if (this.state.name) {
        game = (
          <Lobby
            socket={this.state.socket}
            name={this.state.name}
            players={this.state.players}
            gamePlaying={this.state.gamePlaying}
          />
        )
      } else {
        game = (
          <PreLobby socket={this.state.socket} />
        )
      }
    } else {
      switch (this.state.gameType) {
        case 'Beeramid':
          game = (
            <Beeramid
              socket={this.state.socket}
              name={this.state.name}
            />
          )
          break
        default:
          game = (
            <h1>Unknown Game</h1>
          )
      }
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
