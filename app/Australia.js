import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'

class Australia extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: props.socket,
      name: props.name,
      players: [],
      isHost: false
    }

    this.state.socket.on('gameUpdate', (data) => this.gameUpdate(data))
  }

  gameUpdate(data) {
    this.setState({
      name: data.name,
      players: data.players,
      isHost: data.isHost
    })
  }

  endGame() {
    this.state.socket.emit('endGame', {})
  }

  render() {
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
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <h1>{'Name: ' + this.state.name}</h1>
            <h1>{'IsHost: ' + this.state.isHost}</h1>
            <h1>{'Players: ' + JSON.stringify(this.state.players)}</h1>
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

export default Australia
