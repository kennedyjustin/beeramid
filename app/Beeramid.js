import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'
import Pyramid from './Pyramid'

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
    this.state.socket.emit('nextStage', {})
  }

  render() {

    // TODO: Implement UI

    const players = []
    this.state.players.forEach(player => {
      players.push(player['name'])
    })

    let nextStageButton, endButton
    if (this.state.isHost) {
      nextStageButton = (
        <Row>
          <Col>
            <Button variant="primary" onClick={this.nextStage.bind(this)}>
              Next Stage
            </Button>
          </Col>
        </Row>
      )
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
        <Row className="pyramid">
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <Pyramid pyramid={this.state.pyramid} />
          </Col>
        </Row>
        {nextStageButton}
        {endButton}
      </Container>
    )
  }
}

export default Beeramid
