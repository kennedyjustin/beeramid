import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'

class Beeramid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: props.socket,
      players: [],
      name: props.name,
      isHost: false
    }

    this.state.socket.on('gameUpdate', (data) => this.gameUpdate(data))
  }

  gameUpdate(data) {
    this.setState({
      players: data.players,
      name: data.name,
      isHost: data.isHost
    })
  }

  endGame() {
    this.state.socket.emit('endGame', {})
  }

  render() {

    const players = []
    this.state.players.forEach(player => {
      players.push(player['name'])
    })

    let endButton
    if (this.state.isHost) {
      endButton = (
        <Row>
          <Col>
            <Button variant="primary" onClick={this.endGame.bind(this)}>
              End Game
            </Button>
          </Col>
        </Row>
      )
    }

    return (
      <Container fluid>
        <Row>
          <Col>
            <h1>{'Name: ' + this.state.name}</h1>
            <h1>{'Players: ' + players}</h1>
          </Col>
        </Row>
        {endButton}
      </Container>
    )
  }
}

export default Beeramid
