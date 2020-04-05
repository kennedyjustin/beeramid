import React, { Component } from 'react'
import io from 'socket.io-client'
import { Navbar, Container, Row, Col } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import { v4 as uuidv4 } from 'uuid'
import PreLobby from './PreLobby'
import Lobby from './Lobby'
import Beeramid from './Beeramid'

class App extends Component {
  constructor() {
    super();

    let uuid = null
    let name = null
    const cookies = new Cookies()
    if (!cookies.get('uuid')) {
      uuid = uuidv4()
      cookies.set('uuid', uuid, { path: '/' })
    } else {
      uuid = cookies.get('uuid')
      name = cookies.get('name')
    }

    this.state = {
      socket: io({
        query: {
          uuid: uuid,
          name: name
        }
      }),
      name: name,
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
