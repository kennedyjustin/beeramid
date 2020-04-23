import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, Button, Form } from 'react-bootstrap'
import Sound from 'react-sound'

const GAMES = [
  { name: 'Beeramid', enabled: true },
  { name: 'Australia', enabled: false }
]

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
      game: event.target.id
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

    let startButtons
    if (lobbyMembers >= 2 && !this.state.gamePlaying) {
      startButtons = GAMES.map(game => {
        return (
          <Row>
            <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
              <Button
                id={game['name']}
                variant={game['enabled'] ? 'primary' : 'secondary'}
                disabled={game['enabled'] ? false : true}
                onClick={this.startGame.bind(this)}
              >
                {'Start ' + game['name']}
              </Button>
            </Col>
          </Row>
        )
      })
    }

    return (
      <Container fluid>
        <Sound
          url="/assets/tpb.mp3"
          playStatus={Sound.status.PLAYING}
          loop={true}
        />
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="text-center">
            <h1>Lobby</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <ListGroup>
              {lobbyList}
            </ListGroup>
          </Col>
        </Row>
        {startButtons}
      </Container>
    )
  }
}

export default Lobby
