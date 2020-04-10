import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'
import Pyramid from './Pyramid'
import Hand from './Hand'

class Beeramid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: props.socket,
      players: [],
      name: props.name,
      isHost: false,
      cards: [],
      stage: -1,
      pyramid: [],
      calls: []
    }

    this.state.socket.on('gameUpdate', (data) => this.gameUpdate(data))
  }

  gameUpdate(data) {
    this.setState({
      players: data.players,
      name: data.name,
      isHost: data.isHost,
      cards: data.cards,
      stage: data.stage,
      pyramid: data.pyramid,
      calls: data.calls
    })
  }

  endGame() {
    this.state.socket.emit('endGame', {})
  }

  nextStage() {
    if (this.state.isHost) {
      this.state.socket.emit('nextStage', {})
    }
  }

  render() {

    const players = []
    this.state.players.forEach(player => {
      players.push(player['name'])
    })

    let endButton
    if (this.state.isHost) {
      endButton = (
        <Button variant="primary" onClick={this.endGame.bind(this)}>
          End Game
        </Button>
      )
    }

    return (
      <Container fluid>
        <Row className="pyramid">
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <Pyramid pyramid={this.state.pyramid} nextStage={this.nextStage.bind(this)}/>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <Hand cards={this.state.cards} />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <Hand cards={this.state.cards} />
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <Button variant="primary">
              Player Hands
            </Button>{' '}
            {endButton}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Beeramid
