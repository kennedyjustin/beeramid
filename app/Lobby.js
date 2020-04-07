import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, Button, Form } from 'react-bootstrap'

class Lobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: props.socket,
      name: props.name,
      players: props.players,
      gamePlaying: props.gamePlaying
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name,
      players: nextProps.players,
      gamePlaying: nextProps.gamePlaying
    });
  }

  startGame(event) {
    event.preventDefault()
    this.state.socket.emit('startGame', {
      game: 'Beeramid'
    })
  }

  render() {
    let lobbyMembers = 0
    const lobbyList = this.state.players.map(player => {
      if (player['name']) {
        lobbyMembers++
        return (
          <ListGroup.Item>
            {player['name'] + ' ' + (player['inGame'] ? '(currently playing)' : '')}
          </ListGroup.Item>
        )
      }
    })

    let startButton
    if (lobbyMembers >= 2 && !this.state.gamePlaying) {
      startButton = (
        <Row>
          <Col>
            <Button variant="primary" onClick={this.startGame.bind(this)}>
              Start Beeramid
            </Button>
          </Col>
        </Row>
      )
    }

    return (
      <Container fluid>
        <Row>
          <Col>
            <h1>Lobby</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>
              {lobbyList}
            </ListGroup>
          </Col>
        </Row>
        {startButton}
      </Container>
    )
  }
}

export default Lobby
