import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'
import Pyramid from './Pyramid'
import Hand from './Hand'
import PlayerHands from './PlayerHands'

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

  exposeCard(index) {
    this.state.socket.emit('exposeCard', {
      index: index
    })
  }

  render() {

    const players = []
    this.state.players.forEach(player => {
      players.push(player['name'])
    })

    let finalHr
    let endButton
    if (this.state.isHost) {
      finalHr = (<hr />)
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
            <Hand cards={this.state.cards} exposeCard={this.state.stage > 0 ? this.exposeCard.bind(this): null} />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <PlayerHands players={this.state.players}/>
          </Col>
        </Row>
        {finalHr}
        <Row>
          <Col className="text-center">
            {endButton}
          </Col>
        </Row>
        <Row></Row>
      </Container>
    )
  }
}

export default Beeramid
